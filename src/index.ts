import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import { importHotelContent } from './importers';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const time = 'Time taken to complete all download operations';
  console.time(time);
  await importHotelContent(cookie);
  console.timeEnd(time);
};

importGMXFiles().then();
