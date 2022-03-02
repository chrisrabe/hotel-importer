import {
  getDescriptionsDownloadUrl,
  getFacilityDownloadUrl,
  getHotelContentDownloadUrl,
  getImagesDownloadUrl,
} from '../client';
import { REMOTE_FILES } from '../download-importer/downloader';
import { FileType } from '../stream-importer/stream';
import { Transform } from 'stream';
import {
  descriptionCollector,
  facilityCollector,
  hotelContentMapper,
  imageCollector,
} from '../stream-importer/transforms/mappers';
import { createIndex, generateIndexName } from '../elastic/actions';
import { Client } from '@elastic/elasticsearch';
import {
  elasticLoader,
  ElasticMethod,
} from '../stream-importer/transforms/loader';
import { streamData } from './stream';

interface Importer {
  urlDownloader: (cookie: string) => Promise<string>;
  args: {
    expectedFile: string;
    fileType: FileType;
    transformer: Transform;
    maxItems?: number;
  };
}

export type ImporterType = 'base' | 'descriptions' | 'facilities' | 'images';

const importers: Record<ImporterType, Importer> = {
  base: {
    urlDownloader: getHotelContentDownloadUrl,
    args: {
      expectedFile: REMOTE_FILES.hotelContent,
      fileType: 'JSON',
      transformer: hotelContentMapper(),
    },
  },
  descriptions: {
    urlDownloader: getDescriptionsDownloadUrl,
    args: {
      expectedFile: REMOTE_FILES.descriptions,
      fileType: 'CSV',
      transformer: descriptionCollector(),
    },
  },
  facilities: {
    urlDownloader: getFacilityDownloadUrl,
    args: {
      expectedFile: REMOTE_FILES.facilities,
      fileType: 'CSV',
      transformer: facilityCollector(),
    },
  },
  images: {
    urlDownloader: getImagesDownloadUrl,
    args: {
      expectedFile: REMOTE_FILES.images,
      fileType: 'CSV',
      transformer: imageCollector(),
    },
  },
};

export const startImporter = async (
  importerType: ImporterType,
  cookie: string,
  baseIndex: string,
  client: Client
) => {
  const importer = importers[importerType];
  const remoteUrl = await importer.urlDownloader(cookie);

  const indexName = generateIndexName(`${baseIndex}_${importerType}`);
  await createIndex(client, indexName);

  const indexLoader = elasticLoader(ElasticMethod.Index, client, indexName);
  const { expectedFile, fileType, transformer, maxItems } = importer.args;

  return streamData(
    remoteUrl,
    expectedFile,
    fileType,
    transformer,
    indexLoader,
    maxItems
  );
};
