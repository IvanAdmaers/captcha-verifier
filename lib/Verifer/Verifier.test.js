jest.mock('../Fetch');

const reCaptchaV2SecretKey = 'asasdadsa';
const reCaptchaV3SecretKey = '12sad1233';
const reCaptchaV3PassingScore = 0.5;
const hCaptchaSecretKey = '45asdk1236';
const token = 'someToken';
const ip = 'someIp';

const getReCaptcha3Response = (score = 0) => ({
  success: true,
  score,
  action: 'test',
  challenge_ts: '2021-12-15T12:57:26Z',
  hostname: 'localhost',
});

describe('verifier class', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should throw an error when we try to set config without any secret keys', () => {
    const verifier = require('./Verifier');

    expect(() => {
      verifier.config();
    }).toThrow();
  });

  it('should set reCaptcha V2 secret key', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV2SecretKey });

    expect(verifier._reCaptchaV2.secretKey).toBe(reCaptchaV2SecretKey);
  });

  it('should set reCaptcha V3 secret key', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV3SecretKey });

    expect(verifier._reCaptchaV3.secretKey).toBe(reCaptchaV3SecretKey);
  });

  it('should set reCaptcha V3 passing score', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV3SecretKey, reCaptchaV3PassingScore });

    expect(verifier._reCaptchaV3.passingScore).toBe(reCaptchaV3PassingScore);
  });

  it('should set hCaptcha secret key', () => {
    const verifier = require('./Verifier');

    verifier.config({ hCaptchaSecretKey });

    expect(verifier._hCaptcha.secretKey).toBe(hCaptchaSecretKey);
  });

  it('should throw an error if reCaptcha V2 secret key was not set', () => {
    const verifier = require('./Verifier');

    return expect(verifier.reCaptchaV2(token, ip)).rejects.toThrow();
  });

  it('should throw an error if reCaptcha V3 secret key was not set', () => {
    const verifier = require('./Verifier');

    return expect(verifier.reCaptchaV3(token, ip)).rejects.toThrow();
  });

  it('should throw an error when hCaptcha secret key was not set', () => {
    const verifier = require('./Verifier');

    return expect(verifier.hCaptcha(token, ip)).rejects.toThrow();
  });

  it('should returns success = false when ReCaptcha 3 response score is less than setted', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV3SecretKey, reCaptchaV3PassingScore })

    const response = getReCaptcha3Response(0.3);

    const [success] = verifier._getResult(response);

    expect(success).toBe(false);
  });

  it('should returns success = true when ReCaptcha 3 response score is equals to setted passing scope', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV3SecretKey, reCaptchaV3PassingScore })

    const response = getReCaptcha3Response(reCaptchaV3PassingScore);

    const [success] = verifier._getResult(response);

    expect(success).toBe(true);
  });

  it('should returns success = false when ReCaptcha 3 response score is less than default', () => {
    const verifier = require('./Verifier');

    verifier.config({ reCaptchaV3SecretKey })

    const response = getReCaptcha3Response(verifier._reCaptchaV3.passingScore - 0.1);

    const [success] = verifier._getResult(response);

    expect(success).toBe(false);
  });
});
