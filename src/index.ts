import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();

  const time = 'Time taken to complete all download operations';
  console.time(time);
  console.timeEnd(time);
};

importGMXFiles().then();
