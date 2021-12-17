const https = require('https');

class Fetch {
  /**
   * This method does fetch
   *
   * @async
   * @param {string} url - Server URL
   * @param {Object} options - Fetch options
   * @returns {<Promise>Object} Server response
   */
  do(
    url = '',
    {
      method = 'GET',
      ContentType = 'application/x-www-form-urlencoded',
      body,
    } = {}
  ) {
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
          .on('data', (chunk) => {
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

module.exports = new Fetch();
