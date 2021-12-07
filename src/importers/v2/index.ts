import { getHotelContentDownloadUrl } from '../../client';
import { createUnzipStream } from './stream';
import { hotelContentMapper } from './transforms/mappers';

export const importHotelContent = async <L>(cookie: string, loader: L) => {
  return new Promise((resolve) => {
    (async () => {
      const downloadUrl = await getHotelContentDownloadUrl(cookie);
      const onClose = () => resolve('Done');
      await createUnzipStream(
        downloadUrl,
        'Confident.json',
        'JSON',
        hotelContentMapper(),
        loader,
        onClose
      );
    })();
  });
};

export const importHotelDescription = (cookie: string) => {};

export const importHotelFacilities = (cookie: string) => {};

export const importHotelImages = (cookie: string) => {};
