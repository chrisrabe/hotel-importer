import got from 'got';
import { Parse } from 'unzipper';
const etl = require('etl');
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { ELASTIC_INDEX, getElasticClient } from '../../elastic/client';
import { createIndex, generateIndexName } from '../../elastic/actions';
import { hotelContentMapper } from './transforms/mappers';

export const createUnzipStream = async (
  remoteUrl: string,
  expectedFile: string,
  onClose: () => void
) => {
  const client = await getElasticClient();
  const indexName = generateIndexName(ELASTIC_INDEX);
  console.log(indexName);
  await createIndex(client, indexName);
  const pipeChain = chain([
    parser().on('error', () => ({})),
    streamArray(),
    hotelContentMapper(),
    etl.collect(1000),
    etl.elastic.index(client, indexName, null, { concurrency: 2 }),
  ]);

  got
    .stream(remoteUrl)
    .on('downloadProgress', ({ transferred, total, percent }) => {
      if (transferred === total) {
        onClose();
      }
      const percentage = (percent * 100).toFixed(2);
      console.error(`progress: ${transferred}/${total} (${percentage}%)`);
    })
    .pipe(Parse().on('error', () => ({})))
    .pipe(
      etl.map(async (entry: any) => {
        if (entry.path === expectedFile) {
          return entry.pipe(pipeChain);
        } else {
          return entry.autodrain();
        }
      })
    );
};
