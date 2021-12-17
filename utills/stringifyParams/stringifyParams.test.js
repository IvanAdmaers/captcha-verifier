const stringifyParams = require('./stringifyParams');

describe('stringifyParams', () => {
  it('should returns a correct value', () => {
    const data = {
      token: 'F5ojJjLgBB',
      secretKey: 'wqpuQYNAuFE9',
      ip: '129.43.5.153',
    };
    const expectedValue = `token=${data.token}&secretKey=${data.secretKey}&ip=${data.ip}`;

    expect(stringifyParams(data)).toBe(expectedValue);
  });
});
