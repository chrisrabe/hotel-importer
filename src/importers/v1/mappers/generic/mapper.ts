import BaseMapper from './baseMapper';
import { MapperFunction } from '../../../v2/transforms/mappers/mapperFunctions';

class Mapper<Input, Output> extends BaseMapper<Input, Output> {
  mapper: MapperFunction<Input, Output>;

  constructor(mapper: MapperFunction<Input, Output>) {
    super();
    this.mapper = mapper;
  }

  map(input: Input) {
    this.emit(this.mapper(input));
  }
}

export default Mapper;
