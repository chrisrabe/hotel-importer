import { Transform, TransformCallback } from 'src/importer/stream';
import { MapperFunction } from '../mapperFunctions';

class Mapper<Input, Output> extends Transform {
  private readonly mapper: MapperFunction<Input, Output>;

  constructor(mapper: MapperFunction<Input, Output>) {
    super({ objectMode: true });
    this.mapper = mapper;
  }

  _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
    const item = this.mapper(chunk.value);
    this.push(item);
    done();
  }
}

export default Mapper;
