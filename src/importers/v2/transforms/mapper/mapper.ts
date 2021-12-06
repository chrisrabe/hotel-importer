import { Transform, TransformCallback } from 'stream';
import { MapperFunction } from '../../../v1/mappers/mapperFunctions';

class Mapper<Input, Output> extends Transform {
  private readonly mapper: MapperFunction<Input, Output>;

  constructor(mapper: MapperFunction<Input, Output>) {
    super();
    this.mapper = mapper;
  }

  _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
    const item = this.mapper(chunk);
    this.push(item);
    done();
  }
}

export default Mapper;
