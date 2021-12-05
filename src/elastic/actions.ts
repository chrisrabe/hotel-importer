import { Client } from '@elastic/elasticsearch';
import { Payload } from '../importers/v1/mappers';

export const bulkPushElastic = async <T>(
  client: Client,
  index: string,
  data: T[],
  idProperty: keyof T
) => {
  const body = data.flatMap((doc) => [
    { index: { _index: index, _id: doc[idProperty] } },
    doc,
  ]);
  const { body: bulkResponse } = await client.bulk({ body });
  return bulkResponse;
};

export const bulkUpdateElastic = async (
  client: Client,
  index: string,
  payload: Payload<any>[]
) => {
  const body = payload.flatMap((item) => [
    { update: { _id: item._id, _index: index } },
    { doc: item },
  ]);
  await client.bulk({ body });
};

export const createIndex = async (
  client: Client,
  indexName: string,
  config?: Record<string, any>
): Promise<void> => {
  const indexConfig = config
    ? { ...config, index: indexName }
    : {
        index: indexName,
      };
  try {
    await client.indices.create(indexConfig, { ignore: [400] });
    await client.indices.putSettings({
      index: indexName,
      body: {
        'index.mapping.total_fields.limit': 15000,
      },
    });
  } catch (e) {
    const message = `Error creating index, ${JSON.stringify(e)}`;
    console.log(message);
  }
};

export const generateIndexName = (indexName: string) => {
  const datetime = new Date()
    .toISOString()
    .replace(/\..+/, '')
    .replace(/:/g, '_')
    .toLowerCase();
  return `${indexName}-${datetime}`;
};
