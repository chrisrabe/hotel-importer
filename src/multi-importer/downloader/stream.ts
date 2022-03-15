import got from 'got';
import { Parse as parse } from 'unzip-stream';
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
      .on('downloadProgress', ({ transferred, total, percent }) => {
        const percentage = (percent * 100).toFixed(2);
        console.log(`progress: ${transferred}/${total} (${percentage}%)`);
      })  
      .on('error', console.error)
      .pipe(parse().on('error', () => ({})))
      .pipe(
        new Transform({
          objectMode: true,
          transform(chunk: any, _: BufferEncoding, done: TransformCallback) {
            const file = chunk.path;
            if (file === expectedFile) {
              const outputPath = `${outputDir}/${expectedFile}`;
              chunk.pipe(fs.createWriteStream(outputPath))
              .on('finish', () => {
                done();
                resolve(outputPath);
              })
              .on('error', (err: Error) => console.error(err))
            } else {
              chunk.autodrain();
            }
          },
        })
      );
  });
};
