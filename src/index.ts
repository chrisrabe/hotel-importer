import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import { importHotelContent } from './importer';
import { elasticLoader, ElasticMethod } from './importer/transforms/loader';
import { ELASTIC_INDEX, getElasticClient } from './elastic/client';
import { createIndex, generateIndexName } from './elastic/actions';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();

  const indexName = generateIndexName(ELASTIC_INDEX);
  await createIndex(client, indexName);

  const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
  const updateLoader = elasticLoader(ElasticMethod.Update, client, indexName);

  const time = 'Time taken to complete all download operations';
  const hotelTimer = 'Time taken to download all hotels';
  console.time(time);

  console.time(hotelTimer);
  await importHotelContent(cookie, indexLoader);
  console.timeEnd(hotelTimer);

  console.timeEnd(time);
};

importGMXFiles().then();
