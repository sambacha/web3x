import { OpCode } from '.';
import { EvmContext } from '../vm/evm-context';

class RevertOp implements OpCode {
  public readonly code = 0xfd;
  public readonly mnemonic = 'REVERT';
  public readonly description =
    'Stop execution and revert state changes, without consuming all provided gas and providing a reason';
  public readonly gas = 0;
  public readonly bytes = 1;

  public toString(params: Buffer): string {
    return `${this.mnemonic}`;
  }

  public handle(context: EvmContext) {
    context.halt = true;
    context.reverted = true;
    context.ip += this.bytes;
  }
}

export const Revert = new RevertOp();
