import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../client';
import { createUnzipStream } from './stream';
import {
  BaseMapper,
  getDescriptionMapper,
  getFacilitiesMapper,
  getHotelMapper,
  getImageMapper,
  Payload,
} from './mappers';
import { parseCsv, parseJson, TransformFunction } from './parsers';
import {
  GMXHotelData,
  GMXHotelDescription,
  GMXHotelFacility,
  GMXHotelImage,
} from '../types/gmxTypes';
import {
  HotelContent,
  HotelDescription,
  HotelFacility,
  HotelImage,
} from '../types/elasticTypes';
import { Loader } from '../index';

const MAX_NUM_ITEMS = 1000;

export const importHotelContent = (
  cookie: string,
  loader: Loader<HotelContent>
) =>
  importData<GMXHotelData, HotelContent>(
    cookie,
    'Confident.json',
    getHotelMapper(),
    parseJson,
    getHotelContentDownloadUrl,
    loader
  );

export const importHotelDescription = (
  cookie: string,
  loader: Loader<Payload<HotelDescription>>
) =>
  importData<GMXHotelDescription, Payload<HotelDescription>>(
    cookie,
    'D_en.csv',
    getDescriptionMapper(),
    parseCsv,
    getDescriptionsDownloadUrl,
    loader
  );

export const importHotelFacilities = (
  cookie: string,
  loader: Loader<Payload<HotelFacility>>
) =>
  importData<GMXHotelFacility, Payload<HotelFacility>>(
    cookie,
    'F.csv',
    getFacilitiesMapper(),
    parseCsv,
    getFacilityDownloadUrl,
    loader
  );

export const importHotelImages = (
  cookie: string,
  loader: Loader<Payload<HotelImage>>
) =>
  importData<GMXHotelImage, Payload<HotelImage>>(
    cookie,
    'I.csv',
    getImageMapper(),
    parseCsv,
    getImagesDownloadUrl,
    loader,
    MAX_NUM_ITEMS / 2
  );

const importData = <Input, Output>(
  cookie: string,
  filename: string,
  mapper: BaseMapper<Input, Output>,
  parse: TransformFunction,
  getDownloadUrl: (cookie: string) => Promise<string>,
  loader: Loader<Output>,
  maxItems = MAX_NUM_ITEMS
) =>
  new Promise((resolve) => {
    let collection: Output[] = [];
    mapper.setEmitter((output: Output) => collection.push(output));
    (async () => {
      const timer = `Time taken to process all ${filename}`;
      console.time(timer);
      const downloadUrl = await getDownloadUrl(cookie);
      const onComplete = () => {
        console.timeEnd(timer);
        if (collection.length > 0) {
          loader(collection).then();
          collection = [];
        }
        resolve('Done');
      };
      await createUnzipStream(downloadUrl, filename, (entry) => {
        const onEntry = (record: any) => {
          mapper.map(record);
          if (collection.length === maxItems) {
            loader(collection).then();
            collection = [];
          }
        };
        parse(entry, onEntry, onComplete);
      });
    })();
  });
