import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../client';
import { createUnzipStream } from './stream';
import {
  mapGMXDescriptionToHotelDescription,
  mapGMXFacilityToHotelFacility,
  mapGMXHotelDataToHotelContent,
  mapGMXImageToHotelImage,
  MapperFunction,
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
    mapGMXHotelDataToHotelContent,
    parseJson,
    getHotelContentDownloadUrl
  );

export const importHotelDescription = (cookie: string) =>
  importData<GMXHotelDescription, HotelDescription>(
    cookie,
    'D_en.csv',
    mapGMXDescriptionToHotelDescription,
    parseCsv,
    getDescriptionsDownloadUrl
  );

export const importHotelFacilities = (cookie: string) =>
  importData<GMXHotelFacility, HotelFacility>(
    cookie,
    'F.csv',
    mapGMXFacilityToHotelFacility,
    parseCsv,
    getFacilityDownloadUrl
  );

export const importHotelImages = (cookie: string) =>
  importData<GMXHotelImage, HotelImage>(
    cookie,
    'I.csv',
    mapGMXImageToHotelImage,
    parseCsv,
    getImagesDownloadUrl
  );

const importData = <Input, Output>(
  cookie: string,
  filename: string,
  mapper: MapperFunction<Input, Output>,
  parse: TransformFunction,
  getDownloadUrl: (cookie: string) => Promise<string>
) =>
  new Promise((resolve) => {
    let collection: Output[] = [];
    (async () => {
      const timer = `Time taken to process all ${filename}`;
      console.time(timer);
      const downloadUrl = await getDownloadUrl(cookie);
      const onComplete = () => {
        console.timeEnd(timer);
        resolve('Done');
      };
      await createUnzipStream(downloadUrl, filename, (entry) => {
        const onEntry = (record: any) => {
          const item = mapper(record);
          collection.push(item);
          if (collection.length === MAX_NUM_ITEMS) {
            // flush
            collection = [];
          }
        };
        parse(entry, onEntry, onComplete);
      });
    })();
  });
