import { getAuthenticatedUrlExtractor } from './urlExtractor';

export { loginToGimmonix } from './auth';
export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

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
