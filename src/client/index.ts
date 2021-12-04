import { getAuthenticatedUrlExtractor } from './urlExtractor';
import { GMX_MAPPING_URL } from '../index';

export { loginToGimmonix } from './auth';

export const getHotelContentDownloadUrl = (cookie: string) => {
  const getUrl = getAuthenticatedUrlExtractor(cookie);
  return getUrl(`${GMX_MAPPING_URL}/LatestMapping`, 'resultJsonUrl');
};
