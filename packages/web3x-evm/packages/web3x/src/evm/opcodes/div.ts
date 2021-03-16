import { OpCode } from '.';
import { EvmContext } from '../vm/evm-context';

class DivOp implements OpCode {
  public readonly code = 0x04;
  public readonly mnemonic = 'DIV';
  public readonly description = 'Integer division operation';
  public readonly gas = 5;
  public readonly bytes = 1;

  public toString(params: Buffer): string {
    return `${this.mnemonic}`;
  }

  public handle(context: EvmContext) {
    const v1 = context.stack.pop()!;
    const v2 = context.stack.pop()!;
    context.stack.push(v2 === BigInt(0) ? BigInt(0) : v1 / v2);
    context.ip += this.bytes;
  }
}

export const Div = new DivOp();
