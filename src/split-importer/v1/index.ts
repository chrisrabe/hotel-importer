import { createStream } from './stream';
import { getHotelContentDownloadUrl, loginToGimmonix } from '../../client';
import { ELASTIC_INDEX, getElasticClient } from '../../elastic/client';
import { createIndex, generateIndexName } from '../../elastic/actions';
import {
  elasticLoader,
  ElasticMethod,
} from '../../stream-importer/transforms/loader';

export const importer = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();
  const indexName = generateIndexName(ELASTIC_INDEX + '_base');
  await createIndex(client, indexName);
  console.log('Uploading to index', indexName);
  const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
  const downloadUrl = await getHotelContentDownloadUrl(cookie);
  await createStream(downloadUrl, indexLoader);
};
