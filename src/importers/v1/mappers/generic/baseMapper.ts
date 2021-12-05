export type Emitter<T> = (data: T) => void;

abstract class BaseMapper<Input, Output> {
  protected emitter: Emitter<Output> | undefined;

  abstract map(input: Input): void;

  setEmitter(emitter: Emitter<any>) {
    this.emitter = emitter;
  }

  protected emit(output: Output) {
    if (this.emitter) {
      this.emitter(output);
    }
  }
}

export default BaseMapper;
