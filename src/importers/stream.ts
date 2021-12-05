import got from 'got';
import { Parse } from 'unzipper';
import stream from 'stream';

export const createUnzipStream = async (
  remoteUrl: string,
  expectedFile: string,
  onEntry: (entry: any) => void
) => {
  got
    .stream(remoteUrl)
    .pipe(Parse().on('error', () => ({})))
    .pipe(
      new stream.Transform({
        objectMode: true,
        transform: (entry, e, cb) => {
          const entryFile = entry.path;
          if (expectedFile === entryFile) {
            onEntry(entry);
          } else {
            entry.autodrain();
          }
          cb();
        },
      })
    );
};
