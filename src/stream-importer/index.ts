import {
  importHotelContent,
  importHotelDescription,
  importHotelFacilities,
  importHotelImages,
} from './importer';
import { loginToGimmonix } from '../client';
import { ELASTIC_INDEX, getElasticClient } from '../elastic/client';
import { createIndex, generateIndexName } from '../elastic/actions';
import { elasticLoader, ElasticMethod } from './transforms/loader';

export const importer = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();

  const indexName = generateIndexName(ELASTIC_INDEX);
  await createIndex(client, indexName);

  console.log('Uploading to index', indexName);

  const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
  const updateLoader = elasticLoader(ElasticMethod.Update, client, indexName);

  await startImport(cookie, indexLoader, updateLoader);
};

const startImport = async <L>(
  cookie: string,
  indexLoader: L,
  updateLoader: L
) => {
  const timer = 'Time taken to complete all download operations';
  console.time(timer);

  await importHotelContent(cookie, indexLoader);
  const updateRequests: Promise<void>[] = [
    importHotelFacilities(cookie, updateLoader),
    importHotelDescription(cookie, updateLoader),
    importHotelImages(cookie, updateLoader),
  ];

  await Promise.all(updateRequests);

  console.timeEnd(timer);
};
