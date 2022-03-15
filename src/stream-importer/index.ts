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

  await importHotelContent(cookie, indexLoader);
  const updateRequests: Promise<void>[] = [
    importHotelFacilities(cookie, updateLoader),
    importHotelDescription(cookie, updateLoader),
    importHotelImages(cookie, updateLoader),
  ];

  await Promise.all(updateRequests);

  console.timeEnd(timer);
};
