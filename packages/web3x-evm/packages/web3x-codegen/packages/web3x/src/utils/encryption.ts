import aes from 'browserify-aes';
import randomBytes from 'randombytes';
import { isString } from 'util';
import uuid from 'uuid';
import { scrypt, sha3, pbkdf2 } from '.';

interface ScryptKdfParams {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: string;
}

interface PbKdf2Params {
  dklen: number;
  c: number;
  prf: string;
  salt: string;
}

export interface KeyStore {
  address?: string;
  crypto: {
    cipher: string;
    ciphertext: string;
    cipherparams: {
      iv: string;
    };
    kdf: string;
    kdfparams: ScryptKdfParams | PbKdf2Params;
    mac: string;
  };
  id: string;
  version: number;
}

export async function decrypt(
  v3Keystore: KeyStore | string,
  password: string,
  nonStrict: boolean = false,
): Promise<string> {
  if (!isString(password)) {
    throw new Error('No password given.');
  }

  var json = !isString(v3Keystore) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

  if (json.version !== 3) {
    throw new Error('Not a valid V3 wallet');
  }

  let derivedKey;

  if (json.crypto.kdf === 'scrypt') {
    const { n, r, p, dklen, salt } = json.crypto.kdfparams;

    derivedKey = await scrypt(Buffer.from(password), Buffer.from(salt, 'hex'), n, r, p, dklen);
  } else if (json.crypto.kdf === 'pbkdf2') {
    const { prf, c, dklen, salt } = json.crypto.kdfparams;

    if (prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2');
    }

    derivedKey = await pbkdf2(Buffer.from(password), Buffer.from(salt, 'hex'), c, dklen);
  } else {
    throw new Error('Unsupported key derivation scheme');
  }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

  const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
  if (mac !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong password');
  }

  const iv = Buffer.from(json.crypto.cipherparams.iv, 'hex');
  const aesKey = derivedKey.slice(0, 16);

  const decipher = aes.createDecipheriv(json.crypto.cipher, aesKey, iv);
  return '0x' + Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex');
}

export async function encrypt(
  privateKey: string,
  address: string,
  password: string,
  options: any = {},
): Promise<KeyStore> {
  const cipherAlgo = options.cipher || 'aes-128-ctr';
  const salt: Buffer = options.salt ? Buffer.from(options.salt, 'hex') : randomBytes(32);
  const iv = options.iv ? Buffer.from(options.iv, 'hex') : randomBytes(16);
  const kdf = options.kdf || 'scrypt';
  const id = options.id || uuid.v4({ random: options.uuid || randomBytes(16) });

  if (cipherAlgo !== 'aes-128-ctr') {
    throw new Error('Unsupported cipher');
  }

  let derivedKey;
  let kdfparams;

  if (kdf === 'pbkdf2') {
    const { c = 262144, dklen = 32 } = options;
    derivedKey = await pbkdf2(Buffer.from(password), salt, c, dklen);
    kdfparams = { c, dklen, prf: 'hmac-sha256', salt: salt.toString('hex') };
  } else if (kdf === 'scrypt') {
    const { n = 8192, r = 8, p = 1, dklen = 32 } = options;

    derivedKey = await scrypt(Buffer.from(password), salt, n, r, p, dklen);
    kdfparams = { n, r, p, dklen, salt: salt.toString('hex') };
  } else {
    throw new Error('Unsupported kdf');
  }

  const input = Buffer.from(privateKey.replace('0x', ''), 'hex');
  const aesKey = derivedKey.slice(0, 16);

  const cipher = aes.createCipheriv(cipherAlgo, aesKey, iv);
  if (!cipher) {
    throw new Error('Unsupported cipher');
  }

  const ciphertext = Buffer.concat([cipher.update(input), cipher.final()]);

  const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');

  return {
    version: 3,
    id,
    address: address.toLowerCase().replace('0x', ''),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex'),
      },
      cipher: 'aes-128-ctr',
      kdf: kdf,
      kdfparams: kdfparams,
      mac: mac.toString(),
    },
  };
}
