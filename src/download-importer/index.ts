import { downloadGMXFiles } from './downloader';
import {
  importHotelContent,
  importHotelDescription,
  importHotelFacilities,
  importHotelImages,
} from './importer';

export const importer = async <L>(
  cookie: string,
  indexLoader: L,
  updateLoader: L
) => {
  const timer = 'Time taken to complete all download operations';
  console.time(timer);

  const files = await downloadGMXFiles(cookie);

  await importHotelContent(files.hotelContent, indexLoader);

  await Promise.all([
    importHotelFacilities(files.facilities, updateLoader),
    importHotelDescription(files.descriptions, updateLoader),
    importHotelImages(files.images, updateLoader),
  ]);

  console.timeEnd(timer);
};
