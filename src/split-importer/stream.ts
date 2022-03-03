import got from 'got';
import { promisify } from 'util';
import { Parse } from 'unzip-stream';
import stream, { Transform, TransformCallback } from 'stream';
import { chain } from 'stream-chain';
const etl = require('etl');
import { FileType, chainFns } from '../stream-importer/stream';
import axios from 'axios';

const pipeline = promisify(stream.pipeline);

export const streamData = async <L>(
  remoteUrl: string,
  expectedFile: string,
  fileType: FileType,
  transformer: Transform,
  loader: L,
  maxItems = 1000
) => {
  const timer = `Time taken to download ${expectedFile}`;
  console.time(timer);

  const downloadStream = got.stream(remoteUrl); // input stream

  downloadStream.on('downloadProgress', ({ transferred, total, percent }) => {
    (async () => {
      await axios.post('http://localhost:8080/status', {
        file: expectedFile,
        percent,
        transferred,
        total,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    })();
  });

  const filePipeline = chain([
    ...chainFns[fileType](transformer),
    etl.collect(maxItems),
    loader,
  ]);

  // transforms
  const zipParser = Parse();
  const fileParser = new stream.Transform({
    objectMode: true,
    transform(chunk: any, _: BufferEncoding, cb: TransformCallback) {
      if (chunk.path === expectedFile) {
        chunk.pipe(filePipeline).on('finish', cb);
      } else {
        chunk.autodrain();
        cb();
      }
    },
  });

  try {
    await pipeline(downloadStream, zipParser, fileParser);
    console.timeEnd(timer);
  } catch (e: any) {
    console.error(`Something went wrong: ${e.message}`);
  }
};
