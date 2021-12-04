import dotenv from 'dotenv';
dotenv.config();
import { getHotelContentDownloadUrl, loginToGimmonix } from './client';
import { createUnzipStream } from './stream';
import { parseJson } from './parsers';
import { HotelContent } from './types/elasticTypes';
import { mapGMXHotelDataToHotelContent } from './mappers';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();

  const time = 'Time taken to complete all download operations';
  console.time(time);

  const allHotels: Record<string, HotelContent> = {};

  const getHotels = () =>
    new Promise((resolve) => {
      (async () => {
        const hotelTime = 'Time taken to process all hotels';
        console.time(hotelTime);
        const hotelDownloadUrl = await getHotelContentDownloadUrl(cookie);
        const onComplete = () => {
          console.timeEnd(hotelTime);
          resolve('Done');
        };
        await createUnzipStream(hotelDownloadUrl, 'Confident.json', (entry) => {
          const onEntry = (record: any) => {
            allHotels[record.HotelId] = mapGMXHotelDataToHotelContent(record);
          };
          parseJson(entry, onEntry, onComplete);
        });
      })();
    });

  await getHotels();
  console.log('Hotels inserted', Object.keys(allHotels).length);

  console.timeEnd(time);
};

importGMXFiles().then();
