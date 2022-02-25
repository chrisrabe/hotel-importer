import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './client';
import { importer } from './multi-importer';
import {
  elasticLoader,
  ElasticMethod,
} from './stream-importer/transforms/loader';
import { ELASTIC_INDEX, getElasticClient } from './elastic/client';
import { createIndex, generateIndexName } from './elastic/actions';

// const importGMXFiles = async () => {
//   const cookie = await loginToGimmonix();
//   const client = getElasticClient();

//   const indexName = generateIndexName(ELASTIC_INDEX);
//   await createIndex(client, indexName);

//   console.log('Uploading to index', indexName);

//   const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
//   const updateLoader = elasticLoader(ElasticMethod.Update, client, indexName);

//   await importer(cookie, indexLoader, updateLoader);
// };

const multiImportGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();

  await importer(cookie, client);
};

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

  multiImportGMXFiles().then();
