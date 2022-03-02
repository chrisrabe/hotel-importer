import got from 'got';
import { promisify } from 'util';
import { Parse } from 'unzip-stream';
import stream, { TransformCallback } from 'stream';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { hotelContentMapper } from '../../stream-importer/transforms/mappers';
const etl = require('etl');

const pipeline = promisify(stream.pipeline);
const expectedFile = 'Confident.json';

export const createStream = async <L>(remoteUrl: string, loader: L) => {
  const time = `Time taken to download ${expectedFile}`;
  console.time(time);
  const downloadStream = got.stream(remoteUrl); // input stream
  const filePipeline = chain([
    parser(),
    streamArray(),
    hotelContentMapper(),
    etl.collect(1000),
    loader,
  ]);

  // transforms
  const zipParser = Parse();
  const fileParser = new stream.Transform({
    objectMode: true,
    transform(chunk: any, encoding: BufferEncoding, cb: TransformCallback) {
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
    console.timeEnd(time);
  } catch (e: any) {
    console.error(`Something went wrong: ${e.message}`);
  }
};
