import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@elastic/elasticsearch';

const ELASTIC_HOST = process.env.ELASTIC_HOST || '';
const ELASTIC_USER = process.env.ELASTIC_USER || '';
const ELASTIC_PASS = process.env.ELASTIC_PASS || '';
const ELASTIC_PROTOCOl = process.env.ELASTIC_URL_PROTOCOL || 'https';
export const ELASTIC_INDEX = process.env.ELASTIC_INDEX ?? 'hotel-data';

const createESClient = (host: string, username: string, password: string) => {
  return new Client({
    node: host,
    auth: {
      username,
      password,
    },
    requestTimeout: 60000,
  });
};

export const getElasticClient = () => {
  const nodeUrl = `${ELASTIC_PROTOCOl}://${ELASTIC_HOST}`;
  return createESClient(nodeUrl, ELASTIC_USER, ELASTIC_PASS);
};
