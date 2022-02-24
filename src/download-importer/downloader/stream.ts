import got from 'got';
import { Parse } from 'unzip-stream';
import { Transform, TransformCallback } from 'stream';
import fs from 'fs';

export const downloadFileFromStream = async (
  remoteUrl: string,
  expectedFile: string,
  outputDir: string
) => {
  return new Promise((resolve) => {
    got
      .stream(remoteUrl)
      // .on('downloadProgress', ({ transferred, total, percent }) => {
      //   const percentage = (percent * 100).toFixed(2);
      //   console.error(`progress: ${transferred}/${total} (${percentage}%)`);
      // })
      .pipe(Parse().on('error', (err) => console.log(err)))
      .pipe(
        new Transform({
          objectMode: true,
          transform(chunk: any, _: BufferEncoding, done: TransformCallback) {
            const file = chunk.path;
            if (file === expectedFile) {
              const outputPath = `${outputDir}/${expectedFile}`;
              chunk.pipe(fs.createWriteStream(outputPath)).on('finish', () => {
                done();
                resolve(outputPath);
              });
            } else {
              chunk.autodrain();
            }
          },
        })
      );
  });
};
