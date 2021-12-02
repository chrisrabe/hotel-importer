import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './auth';
import { getAuthenticatedDownloader } from './extractor';
import fs from 'fs';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

const importGMXFiles = async () => {
  const dir = './tmp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const cookie = await loginToGimmonix();
  const authenticatedDownload = getAuthenticatedDownloader(cookie);

  const allFilesBenchmark = 'Time taken to download all files';
  console.time(allFilesBenchmark);
  const downloadRequests: Promise<string>[] = [
    authenticatedDownload({
      url: `${GMX_MAPPING_URL}/LatestMapping`,
      filename: 'result.json',
      path: 'resultJsonUrl',
    }),
    authenticatedDownload({
      url: `${GMX_MAPPING_URL}/Descriptions`,
      filename: 'hotel-descriptions',
      path: 'downloadUrl',
    }),
    authenticatedDownload({
      url: `${GMX_MAPPING_URL}/Photos`,
      filename: 'hotel-images',
      path: 'downloadUrl',
    }),
    authenticatedDownload({
      url: `${GMX_MAPPING_URL}/Facilities`,
      filename: 'hotel-facilities',
      path: 'downloadUrl',
    }),
  ];
  await Promise.all(downloadRequests);
  console.timeEnd(allFilesBenchmark);
};

importGMXFiles().then();
