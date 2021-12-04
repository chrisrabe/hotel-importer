import { getHotelContentDownloadUrl } from '../client';
import { createUnzipStream } from './stream';
import { mapGMXHotelDataToHotelContent, MapperFunction } from './mappers';
import { parseJson, TransformFunction } from './parsers';
import { GMXHotelData } from '../types/gmxTypes';
import { HotelContent } from '../types/elasticTypes';

const MAX_NUM_ITEMS = 1000;

export const importHotelContent = (cookie: string) =>
  importData<GMXHotelData, HotelContent>(
    cookie,
    'Confident.json',
    mapGMXHotelDataToHotelContent,
    parseJson,
    getHotelContentDownloadUrl
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

//     return new Promise((resolve) => {
//       (async () => {
//         const csvTime = `Time taken to process ${params.id}`;
//         console.time(csvTime);
//         const csvDownloadUrl = await authenticatedDownload({
//           url: params.url,
//           path: params.path,
//         });
//         const onComplete = () => {
//           console.timeEnd(csvTime);
//           resolve('Done');
//         };
//         await createUnzipStream(csvDownloadUrl, params.filename, (entry) => {
//           transformEntryToCSV(entry, params.onEntry, onComplete);
//         });
//       })();
//     });
