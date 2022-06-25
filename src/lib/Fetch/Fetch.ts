import https from 'https';

import type { ICaptchaResponse } from '../../types';

interface IDoParams {
  method?: string;
  ContentType?: string;
  body: string;
}

class Fetch {
  /**
   * This method does fetch
   *
   * @async
   * @param {string} url - Server URL
   * @param {Object} options - Fetch options
   * @returns {<Promise>Object} Server response
   */
  public do(
    url: string,
    {
      method = 'GET',
      ContentType = 'application/x-www-form-urlencoded',
      body,
    }: IDoParams
  ): Promise<ICaptchaResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: {
          'Content-Type': ContentType,
        },
      };

      const req = https.request(url, options, (res) => {
        res.setEncoding('utf8');

        let buffer = '';

        res
          .on('error', reject)
          .on('data', (chunk: string) => {
            buffer += chunk;
          })
          .on('end', () => resolve(JSON.parse(buffer)));
      });

      if (body) {
        req.write(body);
      }

      req.on('error', reject).end();
    });
  }
}

export default new Fetch();
