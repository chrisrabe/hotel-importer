import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../client';
import { createUnzipStream } from './stream';
import {
  descriptionCollector,
  facilityCollector,
  hotelContentMapper,
  imageCollector,
} from './transforms/mappers';

export const importHotelContent = <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all hotel content';
  return new Promise((resolve) => {
    (async () => {
      console.time(timer);
      const downloadUrl = await getHotelContentDownloadUrl(cookie);
      const onClose = () => {
        console.timeEnd(timer);
        resolve('Done');
      };
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

export const importHotelDescription = <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all descriptions';
  return new Promise<string>((resolve) => {
    (async () => {
      console.time(timer);
      const downloadUrl = await getDescriptionsDownloadUrl(cookie);
      const onClose = () => {
        console.timeEnd(timer);
        resolve('Done');
      };
      await createUnzipStream(
        downloadUrl,
        'D_en.csv',
        'CSV',
        descriptionCollector(),
        loader,
        onClose
      );
    })();
  });
};
export const importHotelFacilities = <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all facilities';
  return new Promise<string>((resolve) => {
    (async () => {
      console.time(timer);
      const downloadUrl = await getFacilityDownloadUrl(cookie);
      const onClose = () => {
        console.timeEnd(timer);
        resolve('Done');
      };
      await createUnzipStream(
        downloadUrl,
        'F.csv',
        'CSV',
        facilityCollector(),
        loader,
        onClose
      );
    })();
  });
};

export const importHotelImages = <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all images';
  return new Promise<string>((resolve) => {
    (async () => {
      console.time(timer);
      const downloadUrl = await getImagesDownloadUrl(cookie);
      const onClose = () => {
        console.timeEnd(timer);
        resolve('Done');
      };
      await createUnzipStream(
        downloadUrl,
        'I.csv',
        'CSV',
        imageCollector(),
        loader,
        onClose
      );
    })();
  });
};
