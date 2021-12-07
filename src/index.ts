import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import {
  importHotelContent,
  importHotelDescription,
  importHotelFacilities,
  importHotelImages,
} from './importer';
import { elasticLoader, ElasticMethod } from './importer/transforms/loader';
import { ELASTIC_INDEX, getElasticClient } from './elastic/client';
import { createIndex, generateIndexName } from './elastic/actions';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();

  const indexName = generateIndexName(ELASTIC_INDEX);
  await createIndex(client, indexName);

  console.log('Uploading to index', indexName);

  const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
  const updateLoader = elasticLoader(ElasticMethod.Update, client, indexName);

  const time = 'Time taken to complete all download operations';

  console.time(time);

  await importHotelContent(cookie, indexLoader);

  const updateRequests: Promise<string>[] = [
    importHotelFacilities(cookie, updateLoader),
    importHotelDescription(cookie, updateLoader),
    importHotelImages(cookie, updateLoader),
  ];

  await Promise.all(updateRequests);

  console.timeEnd(time);

  await client.close();
};

importGMXFiles().then();
