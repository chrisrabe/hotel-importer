import got from 'got';
import { Parse } from 'unzip-stream';
const etl = require('etl');
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { Transform } from 'stream';
import Papa from 'papaparse';

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
  onClose: () => void
) => {
  const pipeline = chain([
    ...chainFns[fileType](transformer),
    etl.collect(1000),
    loader,
  ]);

  got
    .stream(remoteUrl)
    .on('downloadProgress', ({ transferred, total }) => {
      if (transferred === total) {
        onClose();
      }
      // const percentage = (percent * 100).toFixed(2);
      // console.error(`progress: ${transferred}/${total} (${percentage}%)`);
    })
    .pipe(Parse().on('error', () => ({})))
    .pipe(
      etl.map(async (entry: any) => {
        if (entry.path === expectedFile) {
          return entry.pipe(pipeline);
        } else {
          return entry.autodrain();
        }
      })
    );
};
