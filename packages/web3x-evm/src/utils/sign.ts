/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/

import { hashMessage } from './hash-message';
import { sign as ethLibSign, recover as ethLibRecover, encodeSignature, decodeSignature } from '../eth-lib/account';

export interface Signature {
  message: string;
  messageHash: string;
  r: string;
  s: string;
  v: string;
  signature: string;
}

export function sign(data: string, privateKey: Buffer): Signature {
  var messageHash = hashMessage(data);
  var signature = ethLibSign(messageHash, privateKey);
  var vrs = decodeSignature(signature);
  return {
    message: data,
    messageHash,
    v: vrs[0],
    r: vrs[1],
    s: vrs[2],
    signature,
  };
}

export function recoverFromSignature(signature: Signature): string {
  const { messageHash, v, r, s } = signature;
  return recoverFromSigString(messageHash, encodeSignature([v, r, s]), true);
}

export function recoverFromVRS(message: string, v: string, r: string, s: string, prefixed: boolean = false): string {
  if (!prefixed) {
    message = hashMessage(message);
  }
  return recoverFromSigString(message, encodeSignature([v, r, s]), true);
}

export function recoverFromSigString(message: string, signature: string, preFixed: boolean = false) {
  if (!preFixed) {
    message = hashMessage(message);
  }

  return ethLibRecover(message, signature);
}

export function recover(signature: Signature): string;
export function recover(message: string, v: string, r: string, s: string, prefixed?: boolean): string;
export function recover(message: string, signature: string, preFixed?: boolean);
export function recover(...args: any[]): string {
  switch (args.length) {
    case 1:
      return recoverFromSignature(args[0]);
    case 2:
    case 3:
      return recoverFromSigString(args[0], args[1], args[2]);
    case 4:
    case 5:
      return recoverFromVRS(args[0], args[1], args[2], args[3], args[4]);
  }
  throw new Error('Cannot determine recovery function');
}
