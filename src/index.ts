import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import {
  importHotelContent,
  importHotelDescription,
  importHotelFacilities,
  importHotelImages,
} from './importers';
import { getElasticClient } from './elastic/client';
import {
  bulkPushElastic,
  bulkUpdateElastic,
  createIndex,
  generateIndexName,
} from './elastic/actions';
import { Payload } from './importers/mappers';
import { HotelContent, HotelFacility } from './types/elasticTypes';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';
const ELASTIC_INDEX = process.env.ELASTIC_INDEX ?? 'hotel-data';

export type Loader<T> = (payload: T[]) => Promise<void>;

const importGMXFiles = async () => {
  const client = getElasticClient();
  const cookie = await loginToGimmonix();

  const indexName = generateIndexName(ELASTIC_INDEX);
  await createIndex(client, indexName);

  console.log('Created index', indexName);

  const createElasticInserter =
    <T>(key: keyof T): Loader<T> =>
    async (payload) => {
      await bulkPushElastic(client, indexName, payload, key);
    };

  const createElasticUpdater =
    <T>(): Loader<Payload<T>> =>
    async (payload) => {
      await bulkUpdateElastic(client, indexName, payload);
    };

  const time = 'Time taken to complete all download operations';
  console.time(time);

  try {
    await importHotelContent(
      cookie,
      createElasticInserter<HotelContent>('_id')
    );

    const importAttributes: Promise<unknown>[] = [
      importHotelFacilities(cookie, createElasticUpdater()),
      importHotelDescription(cookie, createElasticUpdater()),
      importHotelImages(cookie, createElasticUpdater()),
    ];

    await Promise.all(importAttributes);
    console.timeEnd(time);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
};

importGMXFiles().then();
