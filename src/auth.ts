import * as superagent from 'superagent';

export const loginToGimmonix = async (): Promise<string> => {
  const username = process.env.GMX_USER;
  const password = process.env.GMX_PASSWORD;
  const url = 'https://live.mapping.works/Mapping/ApiLogin';
  const body = {
    Username: username,
    Password: password,
  };

  return new Promise((resolve, reject) => {
    return superagent
      .post(url)
      .set('Content-Type', 'application/json')
      .send(body)
      .then((response) => {
        const header = response.header;
        const cookies: string = header['set-cookie'].join(';');
        return resolve(cookies);
      })
      .catch(reject);
  });
};
