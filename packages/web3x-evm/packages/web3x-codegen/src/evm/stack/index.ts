export class Stack<T> extends Array<T> {
  constructor(items: T[] = []) {
    super(...items);
  }

  public pop(): T {
    if (this.length === 0) {
      throw new Error('Cannot pop empty stack!');
    }

    return super.pop()!;
  }

  public push(item: T): number {
    if (item === undefined || item === null) {
      throw new Error('Cannot push undefined/null on stack!');
    }

    return super.push(item);
  }
}
