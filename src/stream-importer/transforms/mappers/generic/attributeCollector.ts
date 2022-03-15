import { Transform, TransformCallback } from 'stream';
import { MapperFunction } from '../mapperFunctions';

class AttributeCollector<Input, Output> extends Transform {
  private readonly idKey: keyof Input;
  private id: any;
  private collection: Output[];
  private readonly attributeKey: string;
  private readonly mapper: MapperFunction<Input, Output>;

  constructor(
    idKey: keyof Input,
    attributeKey: string,
    mapper: MapperFunction<Input, Output>
  ) {
    super({ objectMode: true });

    if (!idKey || !attributeKey || !mapper) {
      throw Error('Attempted to construct invalid AttributeCollector');
    }

    this.idKey = idKey;
    this.attributeKey = attributeKey;
    this.mapper = mapper;
    this.collection = [];
  }

  _transform(raw: any, _: string, done: TransformCallback): void {
    const chunk: Input = Object.keys(raw).reduce((acc: any, key: any) => {
      acc[key.trim()] = raw[key];
      return acc;
    }, {});

    const item = this.mapper(chunk);

    if (!item) {
      done();
      return;
    }

    if (!this.id) {
      this.id = chunk[this.idKey];
      this.collection.push(item);
    } else if (this.id === chunk[this.idKey]) {
      this.collection.push(item);
    } else {
      if (this.collection.length >= 1) {
        this.push({
          hotelId: this.id,
          _id: this.id,
          [this.attributeKey]: this.collection,
        });
      }

      this.id = chunk[this.idKey];
      this.collection = [];
      this.collection.push(item);
    }

    done();
  }

  _flush(done: () => void): void {
    if (this.collection.length >= 1) {
      this.push({
        hotelId: this.id,
        _id: this.id,
        [this.attributeKey]: this.collection,
      });
    }

    done();
  }
}

export default AttributeCollector;
