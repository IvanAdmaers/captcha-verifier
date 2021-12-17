const fetch = require('./Fetch');

describe('fetch class', () => {
  it('should throw an error when url was not passed', () => {
    return expect(fetch.do(null)).rejects.toThrow();
  });
});
