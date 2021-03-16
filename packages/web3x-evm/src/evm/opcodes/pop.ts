import { OpCode } from '.';
import { EvmContext } from '../vm/evm-context';

class PopOp implements OpCode {
  public readonly code = 0x50;
  public readonly mnemonic = 'POP';
  public readonly description = 'Remove word from stack';
  public readonly gas = 2;
  public readonly bytes = 1;

  public toString(params: Buffer): string {
    return `${this.mnemonic}`;
  }

  public handle(context: EvmContext) {
    context.stack.pop();
    context.ip += this.bytes;
  }
}

export const Pop = new PopOp();
