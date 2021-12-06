import got from 'got';
import { Parse } from 'unzipper';
const etl = require('etl');
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { ELASTIC_INDEX, getElasticClient } from '../../elastic/client';
import { createIndex, generateIndexName } from '../../elastic/actions';
import { mapGMXHotelDataToHotelContent } from '../v1/mappers/mapperFunctions';

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
    (data: any) => mapGMXHotelDataToHotelContent(data.value),
    etl.collect(1000),
    etl.elastic.index(client, indexName, null, { concurrency: 2 }),
  ]);

  got
    .stream(remoteUrl)
    .on('downloadProgress', ({ transferred, total }) => {
      if (transferred === total) {
        onClose();
      }
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
