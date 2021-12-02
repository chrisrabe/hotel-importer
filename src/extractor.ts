import * as superagent from 'superagent';
import fs from 'fs';
import StreamZip from 'node-stream-zip';
import { rejects } from 'assert';

interface DownloadOptions {
  url: string;
  filename: string;
  path: string;
}

const unzipFile = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`Unzipping ${filename}...`);
    const zip = new StreamZip.async({ file: filename });
    zip.on('entry', async (entry) => {
      console.log(entry.name);
      await zip.extract(entry.name, `./tmp/${entry.name}`);
      await zip.close();
      console.log(`Extracted ${filename} done!`);
      return resolve(entry.name);
    });
  });
};

export const getAuthenticatedDownloader =
  (cookie: string) =>
  (options: DownloadOptions): Promise<string> => {
    const { url, filename, path } = options;
    console.log('Start downloading: ', options);
    const time = `Time taken to download ${filename}`;
    console.time(time);
    return new Promise<string>((resolve, reject) => {
      superagent
        .get(url)
        .set('Cookie', cookie)
        .then((res) => {
          const jsonResponse = JSON.parse(res.text);
          const urlToDownload = jsonResponse[path];
          const stream = fs.createWriteStream(`./tmp/${filename}.zip`);

          stream.on('finish', async () => {
            const file = await unzipFile(`./tmp/${filename}.zip`);
            console.timeEnd(time);
            return resolve(file);
          });

          stream.on('error', async (e) => {
            return reject(e);
          });

          superagent.get(urlToDownload).pipe(stream);
        })
        .catch(reject);
    });
  };
