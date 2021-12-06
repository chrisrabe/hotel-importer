import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import { getImporterV2 } from './importers';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const importer = getImporterV2();

  const time = 'Time taken to complete all download operations';
  const hotelTimer = 'Time taken to download all hotels';
  console.time(time);

  console.time(hotelTimer);
  await importer.importHotelContent(cookie);
  console.timeEnd(hotelTimer);

  console.timeEnd(time);
};

importGMXFiles().then();
