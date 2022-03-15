import { Client } from '@elastic/elasticsearch';
import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../client';
import { createIndex, generateIndexName } from '../elastic/actions';
import { ELASTIC_INDEX } from '../elastic/client';
import {
  elasticLoader,
  ElasticMethod,
} from '../stream-importer/transforms/loader';
import { REMOTE_FILES, TMP_DIRECTORY } from './downloader';
import {
  importHotelContent,
  importHotelDescription,
  importHotelFacilities,
  importHotelImages,
} from './importer';

const files = {
  hotelContent: `${TMP_DIRECTORY}/${REMOTE_FILES.hotelContent}`,
  descriptions: `${TMP_DIRECTORY}/${REMOTE_FILES.descriptions}`,
  images: `${TMP_DIRECTORY}/${REMOTE_FILES.images}`,
  facilities: `${TMP_DIRECTORY}/${REMOTE_FILES.facilities}`,
};

const indexTypes: Record<string, any> = {
  base: {
    file: files.hotelContent,
    urlDownloader: getHotelContentDownloadUrl,
    importer: importHotelContent,
  },
  description: {
    file: files.descriptions,
    urlDownloader: getDescriptionsDownloadUrl,
    importer: importHotelDescription,
  },
  facilities: {
    file: files.facilities,
    urlDownloader: getFacilityDownloadUrl,
    importer: importHotelFacilities,
  },
  images: {
    file: files.images,
    urlDownloader: getImagesDownloadUrl,
    importer: importHotelImages,
  },
};

export const importer = async (cookie: string, client: Client) => {
  const timer = 'Time taken to complete all download operations';
  console.time(timer);

  await Promise.all(
    Object.keys(indexTypes).map(async (indexType: string) => {
      const indexName = generateIndexName(`${ELASTIC_INDEX}_${indexType}`);
      console.log("Created new index " + indexName);
      await createIndex(client, indexName);

      const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
      const { file, importer } = indexTypes[indexType];

      // TODO: download the file here

      await importer(file, indexLoader);
      console.log('Done');

      // TODO:
      // - modify mappers so they have hotelIds
      // - Q: do we index one image per document OR array of images in one document?
      // - create stream pipeline to read file data and stream to elasticsearch
      // - create query
      //    - can we group results by hotelId? e.g. images
    })
  );

  console.timeEnd(timer);
};
