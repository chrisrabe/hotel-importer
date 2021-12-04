import { getHotelContentDownloadUrl } from '../client';
import { createUnzipStream } from './stream';
import { mapGMXHotelDataToHotelContent } from './mappers';
import { parseJson } from './parsers';

export const importHotelContent = (cookie: string) =>
  new Promise((resolve) => {
    const allHotels = [];
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
          const hotel = mapGMXHotelDataToHotelContent(record);
          allHotels.push(hotel);
        };
        parseJson(entry, onEntry, onComplete);
      });
    })();
  });
