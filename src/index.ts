import dotenv from 'dotenv';
dotenv.config();
import { loginToGimmonix } from './auth';
import { getAuthenticatedUrlExtractor } from './extractor';
import { createUnzipStream } from './stream';
import { transformEntryToJson, transformEntryToCSV } from './transforms';
import { HotelContent } from './elasticTypes';
import {
  mapGMXDescriptionToHotelDescription,
  mapGMXFacilityToHotelFacility,
  mapGMXHotelDataToHotelContent,
  mapGMXImageToHotelImage,
} from './mappers';

export const GMX_MAPPING_URL = 'https://live.mapping.works/Mapping';

const importGMXFiles = async () => {
  const cookie = await loginToGimmonix();
  const authenticatedDownload = getAuthenticatedUrlExtractor(cookie);

  const time = 'Time taken to complete all download operations';
  console.time(time);

  const allHotels: Record<string, HotelContent> = {};
  const missedHotels: Record<string, any> = {};

  const hotelInfoRequestParams = [
    {
      id: 'facilities',
      url: `${GMX_MAPPING_URL}/Facilities`,
      path: 'downloadUrl',
      filename: 'F.csv',
      onEntry: (record: any) => {
        const facility = mapGMXFacilityToHotelFacility(record);
        if (allHotels[record.HotelId]) {
          allHotels[record.HotelId].facilities.push(facility);
        } else {
          missedHotels[record.HotelId] = record.HotelId;
        }
      },
    },
    {
      id: 'images',
      url: `${GMX_MAPPING_URL}/Photos`,
      path: 'downloadUrl',
      filename: 'I.csv',
      onEntry: (record: any) => {
        const image = mapGMXImageToHotelImage(record);
        if (allHotels[record.HotelId]) {
          allHotels[record.HotelId].images.push(image);
        } else {
        }
      },
    },
    {
      id: 'descriptions',
      url: `${GMX_MAPPING_URL}/Descriptions`,
      path: 'downloadUrl',
      filename: 'D.csv',
      onEntry: (record: any) => {
        const description = mapGMXDescriptionToHotelDescription(record);
        if (allHotels[record.HotelId]) {
          allHotels[record.HotelId].descriptions.push(description);
        } else {
        }
      },
    },
  ];

  const getHotels = () =>
    new Promise((resolve) => {
      (async () => {
        const hotelTime = 'Time taken to process all hotels';
        console.time(hotelTime);
        const hotelDownloadUrl = await authenticatedDownload({
          url: `${GMX_MAPPING_URL}/LatestMapping`,
          path: 'resultJsonUrl',
        });
        await createUnzipStream(hotelDownloadUrl, 'Confident.json', (entry) => {
          const onComplete = () => {
            console.timeEnd(hotelTime);
            resolve('Done');
          };
          const onEntry = (record: any) => {
            allHotels[record.HotelId] = mapGMXHotelDataToHotelContent(record);
          };
          transformEntryToJson(entry, onEntry, onComplete);
        });
      })();
    });

  const populateHotelInfo = () =>
    hotelInfoRequestParams.map((params) => {
      return new Promise((resolve) => {
        (async () => {
          const csvTime = `Time taken to process ${params.id}`;
          console.time(csvTime);
          const csvDownloadUrl = await authenticatedDownload({
            url: params.url,
            path: params.path,
          });
          await createUnzipStream(csvDownloadUrl, params.filename, (entry) => {
            const onComplete = () => {
              console.timeEnd(csvTime);
              resolve('Done');
            };
            transformEntryToCSV(entry, params.onEntry, onComplete);
          });
        })();
      });
    });

  await getHotels();
  console.log('Hotels inserted', Object.keys(allHotels).length);
  await Promise.all(populateHotelInfo());

  console.timeEnd(time);
  console.log('Number of hotels missing', Object.keys(missedHotels).length);
};

importGMXFiles().then();
