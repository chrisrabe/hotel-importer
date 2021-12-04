import { MapperFunction } from '../mapperFunctions';
import BaseMapper from './baseMapper';

export type Payload<T> = { _id: any; [x: string]: T[] };

class AttributeCollector<Input, Output> extends BaseMapper<
  Input,
  Payload<Output>
> {
  idKey: keyof Input;
  id: any;
  collection: Output[];
  attributeKey: string;

  mapper: MapperFunction<Input, Output>;

  constructor(
    idKey: keyof Input,
    attributeKey: string,
    mapper: MapperFunction<Input, Output>
  ) {
    super();
    this.collection = [];
    this.idKey = idKey;
    this.attributeKey = attributeKey;
    this.mapper = mapper;
  }

  map(input: Input) {
    const item = this.mapper(input);

    if (!this.id) {
      this.id = input[this.idKey];
      this.collection.push(item);
    } else if (this.id === input[this.idKey]) {
      this.collection.push(item);
    } else {
      if (this.collection.length >= 1) {
        this.emit({ _id: this.id, [this.attributeKey]: this.collection });
      }
      this.id = input[this.idKey];
      this.collection = [item];
    }
  }
}

export default AttributeCollector;
