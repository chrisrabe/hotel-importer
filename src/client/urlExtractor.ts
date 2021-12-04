import * as superagent from 'superagent';

export const getAuthenticatedUrlExtractor =
  (cookie: string) =>
  (url: string, path: string): Promise<string> => {
    const options = { url, path };
    console.log('Extracting file URL path', options);
    const time = `Time taken to extract download URL from ${url}`;
    console.time(time);
    return new Promise<string>((resolve, reject) => {
      superagent
        .get(url)
        .set('Cookie', cookie)
        .then((res) => {
          const jsonResponse = JSON.parse(res.text);
          const urlToDownload = jsonResponse[path];
          console.timeEnd(time);
          if (!urlToDownload.startsWith('http')) {
            resolve(`https://${urlToDownload}`);
          } else {
            resolve(urlToDownload);
          }
        })
        .catch(reject);
    });
  };
