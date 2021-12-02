import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './auth';
import { getAuthenticatedUrlExtractor } from './extractor';
import fs from 'fs';
import got from 'got';
import * as readline from 'readline';
import unzip from 'unzipper';
import stream from 'stream';
import { createUnzipStream } from './stream';
import { transformEntryToJson } from './transforms';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

const importGMXFiles = async () => {
  const dir = './tmp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const cookie = await loginToGimmonix();
  const authenticatedDownload = getAuthenticatedUrlExtractor(cookie);
  const mappingDownloadUrl = await authenticatedDownload({
    url: `${GMX_MAPPING_URL}/LatestMapping`,
    filename: 'result.json',
    path: 'resultJsonUrl',
  });

  const time = 'Time taken to extract from zip';
  console.time(time);

  const allHotels: Record<string, any> = {};

  const readDownloadUrl = new Promise((resolve) => {
    (async () => {
      await createUnzipStream(mappingDownloadUrl, 'Confident.json', (entry) => {
        const onComplete = () => resolve('Done');
        const onEntry = (record: Record<string, any>) => {
          allHotels[record.HotelId] = record;
        };
        transformEntryToJson(entry, onEntry, onComplete);
      });
    })();
  });

  await readDownloadUrl;

  console.timeEnd(time);
};

importGMXFiles().then();
