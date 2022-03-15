import got from 'got';
import { Parse } from 'unzip-stream';
const etl = require('etl');
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { Transform, TransformCallback } from 'stream';
import Papa from 'papaparse';
import { promisify } from 'util';
import stream from 'stream';

const pipeline = promisify(stream.pipeline);

export const chainFns = {
  JSON: (mapper: Transform) => [
    parser().on('error', () => ({})),
    streamArray(),
    mapper,
  ],
  CSV: (collector: Transform) => [
    Papa.parse(Papa.NODE_STREAM_INPUT, {
      fastMode: true,
      delimiter: '|',
      header: true,
    }),
    collector,
  ],
};

export type FileType = keyof typeof chainFns;

export const createUnzipStream = async <L>(
  remoteUrl: string,
  expectedFile: string,
  fileType: FileType,
  transformer: Transform,
  loader: L,
  maxItems = 1000
) => {
  const downloadStream = got.stream(remoteUrl);

  const filePipeline = chain([
    ...chainFns[fileType](transformer),
    etl.collect(maxItems),
    loader,
  ]);

  const zipParser = Parse().on('error', () => ({}));
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
  } catch (e: any) {
    console.error(`Something went wrong: ${e.message}`);
  }
};
