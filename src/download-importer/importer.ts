import { chainFns, FileType } from '../stream-importer/stream';
import { Transform } from 'stream';
import { chain } from 'stream-chain';
import fs from 'fs';
import {
  descriptionCollector,
  facilityCollector,
  hotelContentMapper,
  imageCollector,
} from '../stream-importer/transforms/mappers';
const etl = require('etl');

export const importHotelContent = <L>(path: string, loader: L) => {
  return importFile(path, 'JSON', hotelContentMapper(), loader);
};

export const importHotelDescription = <L>(path: string, loader: L) => {
  return importFile(path, 'CSV', descriptionCollector(), loader);
};

export const importHotelFacilities = <L>(path: string, loader: L) => {
  return importFile(path, 'CSV', facilityCollector(), loader);
};

export const importHotelImages = <L>(path: string, loader: L) => {
  return importFile(path, 'CSV', imageCollector(), loader);
};

const importFile = <L>(
  filePath: string,
  fileType: FileType,
  transformer: Transform,
  loader: L
) => {
  const timer = `Time to import ${filePath}`;
  console.time(timer);
  return new Promise((resolve, reject) => {
    const pipeline = chain([
      fs.createReadStream(filePath),
      ...chainFns[fileType](transformer),
      etl.collect(1000),
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
