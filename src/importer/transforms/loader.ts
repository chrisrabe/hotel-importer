import { Client } from '@elastic/elasticsearch';

const etl = require('etl');

const ELASTIC_CONCURRENCY = 2;

export enum ElasticMethod {
  Index = 'index',
  Update = 'update',
}

export const elasticLoader = (
  method: ElasticMethod,
  client: Client,
  indexName: string
) =>
  etl.elastic[method](client, indexName, null, {
    concurrency: ELASTIC_CONCURRENCY,
  });
