import { chainFns, FileType } from '../stream-importer/stream';
import { Transform } from 'stream';
import { chain } from 'stream-chain';
import fs from 'fs';
import {
  descriptionMapper,
  facilityMapper,
  hotelContentMapper,
  imageMapper,
} from '../stream-importer/transforms/mappers';
const etl = require('etl');

export const importHotelContent = <L>(path: string, loader: L) => {
  console.log('Uploading hotel content to elasticsearch...');
  return importFile(path, 'JSON', hotelContentMapper(), loader);
};

export const importHotelDescription = <L>(path: string, loader: L) => {
  console.log('Uploading hotel description to elasticsearch...');
  return importFile(path, 'CSV', descriptionMapper(), loader, 5000);
};

export const importHotelFacilities = <L>(path: string, loader: L) => {
  console.log('Uploading hotel facilities to elasticsearch...');
  return importFile(path, 'CSV', facilityMapper(), loader, 5000);
};

export const importHotelImages = <L>(path: string, loader: L) => {
  console.log('Uploading hotel images to elasticsearch...');
  return importFile(path, 'CSV', imageMapper(), loader, 5000);
};

const importFile = <L>(
  filePath: string,
  fileType: FileType,
  transformer: Transform,
  loader: L,
  maxItems = 1000
) => {
  const timer = `Time to import ${filePath}`;
  console.time(timer);
  return new Promise((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(filePath),
      ...chainFns[fileType](transformer),
      etl.collect(maxItems),
      loader,
    ]);
    let counter = 0;
    pipeline.on('data', () => ++counter);
    pipeline.on('error', (e) => reject(e));
    pipeline.on('end', () => {
      console.timeEnd(timer);
      console.log(`Uploaded ${counter} items`);
      resolve('Done');
    });
  });
};
