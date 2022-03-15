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

export const importHotelContent = async <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all hotel content';
  console.time(timer);
  const downloadUrl = await getHotelContentDownloadUrl(cookie);
  await createUnzipStream(
    downloadUrl,
    'Confident.json',
    'JSON',
    hotelContentMapper(),
    loader
  );
  console.timeEnd(timer);
};

export const importHotelDescription = async <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all descriptions';
  console.time(timer);
  const downloadUrl = await getDescriptionsDownloadUrl(cookie);
  await createUnzipStream(
    downloadUrl,
    'D_en.csv',
    'CSV',
    descriptionCollector(),
    loader
  );
  console.timeEnd(timer);
};

export const importHotelFacilities = async <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all facilities';
  console.time(timer);
  const downloadUrl = await getFacilityDownloadUrl(cookie);
  await createUnzipStream(
    downloadUrl,
    'F.csv',
    'CSV',
    facilityCollector(),
    loader
  );
  console.timeEnd(timer);
};

export const importHotelImages = async <L>(cookie: string, loader: L) => {
  const timer = 'Time taken to import all images';
  console.time(timer);
  const downloadUrl = await getImagesDownloadUrl(cookie);
  await createUnzipStream(
    downloadUrl,
    'I.csv',
    'CSV',
    imageCollector(),
    loader
  );
  console.timeEnd(timer);
};
