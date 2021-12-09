import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import { importer } from './stream-importer';
import { elasticLoader, ElasticMethod } from './stream-importer/transforms/loader';
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

  await importer(cookie, indexLoader, updateLoader);
};

importGMXFiles().then();
