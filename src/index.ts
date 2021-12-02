import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './auth';
import { getAuthenticatedUrlExtractor } from './extractor';
import fs from 'fs';
import got from 'got';
import * as readline from 'readline';
import unzip from 'unzipper';
import stream from 'stream';

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

  const readDownloadUrl = new Promise((resolve) => {
    (async () => {
      got
        .stream(mappingDownloadUrl)
        .pipe(unzip.Parse())
        .pipe(
          new stream.Transform({
            objectMode: true,
            transform: (entry, e, cb) => {
              const fileName = entry.path;
              const ignored = ['[', ']'];
              let constructedObj: string[] = [];
              if (fileName === 'Confident.json') {
                const lineReader = readline.createInterface({
                  input: entry,
                });
                lineReader.on('line', (line) => {
                  const trimmedLine = line.trim();
                  if (!ignored.includes(trimmedLine)) {
                    if (trimmedLine === '}' || trimmedLine === '},') {
                      constructedObj.push('}');
                      const jsonObj = JSON.parse(constructedObj.join(''));
                      constructedObj = [];
                    } else {
                      constructedObj.push(trimmedLine);
                    }
                  }
                });
                lineReader.on('close', () => {
                  resolve('Done');
                });
              } else {
                entry.autodrain();
              }
              cb();
            },
          })
        );
    })();
  });
  await readDownloadUrl;

  console.timeEnd(time);
};

importGMXFiles().then();
