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

const MAX_NUM_ITEMS = 1000;

export const importHotelContent = (cookie: string) =>
  importData<GMXHotelData, HotelContent>(
    cookie,
    'Confident.json',
    getHotelMapper(),
    parseJson,
    getHotelContentDownloadUrl
  );

export const importHotelDescription = (cookie: string) =>
  importData<GMXHotelDescription, Payload<HotelDescription>>(
    cookie,
    'D_en.csv',
    getDescriptionMapper(),
    parseCsv,
    getDescriptionsDownloadUrl
  );

export const importHotelFacilities = (cookie: string) =>
  importData<GMXHotelFacility, Payload<HotelFacility>>(
    cookie,
    'F.csv',
    getFacilitiesMapper(),
    parseCsv,
    getFacilityDownloadUrl
  );

export const importHotelImages = (cookie: string) =>
  importData<GMXHotelImage, Payload<HotelImage>>(
    cookie,
    'I.csv',
    getImageMapper(),
    parseCsv,
    getImagesDownloadUrl
  );

const importData = <Input, Output>(
  cookie: string,
  filename: string,
  mapper: BaseMapper<Input, Output>,
  parse: TransformFunction,
  getDownloadUrl: (cookie: string) => Promise<string>
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
          // flush
        }
        resolve('Done');
      };
      await createUnzipStream(downloadUrl, filename, (entry) => {
        const onEntry = (record: any) => {
          mapper.map(record);
          if (collection.length === MAX_NUM_ITEMS) {
            // process
            collection = [];
          }
        };
        parse(entry, onEntry, onComplete);
      });
    })();
  });
