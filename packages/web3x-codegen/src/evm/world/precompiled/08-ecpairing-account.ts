import { LevelUp } from 'levelup';
import bn128 from 'rustbn.js';
import { Address } from '../../../address';
import { Trie } from '../../trie';
import { EvmContext } from '../../vm';
import { EvmAccount } from '../evm-account';

export class EcPairingAccount extends EvmAccount {
  constructor(address: Address, nonce: bigint, balance: bigint, storage: Trie, code: Buffer) {
    super(address, nonce, balance, storage, code);
  }

  public static fromDb(db: LevelUp) {
    return new EcPairingAccount(
      Address.fromString('0x0000000000000000000000000000000000000008'),
      BigInt(0),
      BigInt(0),
      new Trie(db),
      Buffer.of(),
    );
  }

  public async run(callContext: EvmContext) {
    const { calldata } = callContext;

    const result = bn128.pairing(calldata);

    callContext.halt = true;

    if (result.length !== 32) {
      callContext.reverted = true;
      callContext.returned = Buffer.of();
    } else {
      callContext.returned = result;
    }

    return callContext;
  }
}
