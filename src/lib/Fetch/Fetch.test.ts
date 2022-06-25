import fetch from './Fetch';

describe('fetch class', () => {
  it('should throw an error when url was not passed', () => {
    return expect(fetch.do('', { body: '' })).rejects.toThrow();
  });
});
