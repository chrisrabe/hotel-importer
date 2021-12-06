import { getHotelContentDownloadUrl } from '../../client';
import { createUnzipStream } from './stream';

export const importHotelContent = async (cookie: string) => {
  return new Promise((resolve) => {
    (async () => {
      const downloadUrl = await getHotelContentDownloadUrl(cookie);
      await createUnzipStream(downloadUrl, 'Confident.json', () =>
        resolve('Done')
      );
    })();
  });
};

export const importHotelDescription = (cookie: string) => {};

export const importHotelFacilities = (cookie: string) => {};

export const importHotelImages = (cookie: string) => {};
