import { loginToGimmonix } from '../client';
import { ELASTIC_INDEX, getElasticClient } from '../elastic/client';
import { importData } from './importer';

export const importer = async () => {
  const cookie = await loginToGimmonix();
  const client = getElasticClient();

  const timer = 'Time to complete all import operations';
  console.time(timer);

  await Promise.all([
    importData('base', cookie, ELASTIC_INDEX, client),
    importData('descriptions', cookie, ELASTIC_INDEX, client),
    importData('facilities', cookie, ELASTIC_INDEX, client),
    importData('images', cookie, ELASTIC_INDEX, client),
  ]);

  console.timeEnd(timer);
};
