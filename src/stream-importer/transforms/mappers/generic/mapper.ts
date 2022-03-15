import { Transform, TransformCallback } from 'stream';
import { MapperFunction } from '../mapperFunctions';

class Mapper<Input, Output> extends Transform {
  private readonly mapper: MapperFunction<Input, Output>;

  constructor(mapper: MapperFunction<Input, Output>) {
    super({ objectMode: true });
    this.mapper = mapper;
  }

  _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
    const data = chunk.value || this.cleanChunk(chunk);
    const item = this.mapper(data);
    this.push(item);
    done();
  }

  private cleanChunk(chunk: any) {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(chunk)) {
      newObj[key.trim()] = chunk[key];
    }
    return newObj;
  }
}

export default Mapper;
