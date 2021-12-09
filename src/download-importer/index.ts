import { downloadGMXFiles } from './downloader';

export const importer = async <L>(
  cookie: string,
  indexLoader: L,
  updateLoader: L
) => {
  const files = await downloadGMXFiles(cookie);
};
