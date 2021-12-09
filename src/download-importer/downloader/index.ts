import fs from 'fs';
import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../../client';
import { downloadFileFromStream } from './stream';

interface RemoteFiles {
  hotelContent: string;
  descriptions: string;
  images: string;
  facilities: string;
}

const TMP_DIRECTORY = './tmp';

const REMOTE_FILES: RemoteFiles = {
  hotelContent: 'Confident.json',
  descriptions: 'D_en.csv',
  images: 'I.csv',
  facilities: 'F.csv',
};

export const downloadGMXFiles = async (
  cookie: string
): Promise<RemoteFiles> => {
  if (!fs.existsSync(TMP_DIRECTORY)) {
    fs.mkdirSync(TMP_DIRECTORY, { recursive: true });
  }
  const timer = 'Time taken to download all files';
  console.time(timer);
  await Promise.all([
    downloadHotelContent(cookie),
    downloadHotelDescriptions(cookie),
    downloadHotelFacilities(cookie),
    downloadHotelImages(cookie),
  ]);
  console.timeEnd(timer);
  return {
    hotelContent: `${TMP_DIRECTORY}/${REMOTE_FILES.hotelContent}`,
    descriptions: `${TMP_DIRECTORY}/${REMOTE_FILES.descriptions}`,
    images: `${TMP_DIRECTORY}/${REMOTE_FILES.images}`,
    facilities: `${TMP_DIRECTORY}/${REMOTE_FILES.facilities}`,
  };
};

const downloadHotelContent = async (cookie: string) => {
  const timer = 'Time taken to download hotel content';
  console.time(timer);
  const downloadUrl = await getHotelContentDownloadUrl(cookie);
  const res = await downloadFileFromStream(
    downloadUrl,
    REMOTE_FILES.hotelContent,
    TMP_DIRECTORY
  );
  console.timeEnd(timer);
  return res;
};

const downloadHotelDescriptions = async (cookie: string) => {
  const timer = 'Time taken to download hotel descriptions';
  console.time(timer);
  const downloadUrl = await getDescriptionsDownloadUrl(cookie);
  const res = await downloadFileFromStream(
    downloadUrl,
    REMOTE_FILES.descriptions,
    TMP_DIRECTORY
  );
  console.timeEnd(timer);
  return res;
};

const downloadHotelImages = async (cookie: string) => {
  const timer = 'Time taken to download hotel images';
  console.time(timer);
  const downloadUrl = await getImagesDownloadUrl(cookie);
  const res = await downloadFileFromStream(
    downloadUrl,
    REMOTE_FILES.images,
    TMP_DIRECTORY
  );
  console.timeEnd(timer);
  return res;
};

const downloadHotelFacilities = async (cookie: string) => {
  const timer = 'Time taken to download hotel facilities';
  console.time(timer);
  const downloadUrl = await getFacilityDownloadUrl(cookie);
  const res = await downloadFileFromStream(
    downloadUrl,
    REMOTE_FILES.facilities,
    TMP_DIRECTORY
  );
  console.timeEnd(timer);
  return res;
};
