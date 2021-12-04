import { getAuthenticatedUrlExtractor } from './urlExtractor';
import { GMX_MAPPING_URL } from '../index';

export { loginToGimmonix } from './auth';

export const getHotelContentDownloadUrl = (cookie: string) => {
  const getUrl = getAuthenticatedUrlExtractor(cookie);
  return getUrl(`${GMX_MAPPING_URL}/LatestMapping`, 'resultJsonUrl');
};

export const getFacilityDownloadUrl = (cookie: string) => {
  const getUrl = getAuthenticatedUrlExtractor(cookie);
  return getUrl(`${GMX_MAPPING_URL}/Facilities`, 'downloadUrl');
};

export const getDescriptionsDownloadUrl = (cookie: string) => {
  const getUrl = getAuthenticatedUrlExtractor(cookie);
  return getUrl(`${GMX_MAPPING_URL}/Descriptions`, 'downloadUrl');
};

export const getImagesDownloadUrl = (cookie: string) => {
  const getUrl = getAuthenticatedUrlExtractor(cookie);
  return getUrl(`${GMX_MAPPING_URL}/Photos`, 'downloadUrl');
};
