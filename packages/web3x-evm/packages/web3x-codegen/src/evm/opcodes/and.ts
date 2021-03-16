import { OpCode } from '.';
import { EvmContext } from '../vm/evm-context';

class AndOp implements OpCode {
  public readonly code = 0x16;
  public readonly mnemonic = 'AND';
  public readonly description = 'Bitwise AND operation';
  public readonly gas = 3;
  public readonly bytes = 1;

  public toString(params: Buffer): string {
    return `${this.mnemonic}`;
  }

  public handle(context: EvmContext) {
    const v1 = context.stack.pop()!;
    const v2 = context.stack.pop()!;
    context.stack.push(v1 & v2);
    context.ip += this.bytes;
  }
}

export const And = new AndOp();
