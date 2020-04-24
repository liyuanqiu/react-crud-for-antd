export class AssertionError extends Error {
  constructor(msg?: string) {
    super(msg ?? 'NO_MESSAGE');
  }
}

export function assert(condition: boolean, msg?: string): asserts condition {
  if (condition === false) {
    throw new AssertionError(msg);
  }
}
