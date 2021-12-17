const fetch = require('../Fetch');

const { stringifyParams } = require('../../utills');

const reCaptchaV2 = '_reCaptchaV2';
const reCaptchaV3 = '_reCaptchaV3';
const hCaptcha = '_hCaptcha';

class Verifier {
  constructor() {
    this._reCaptchaV2 = {
      secretKey: '',
      url: 'https://www.google.com/recaptcha/api/siteverify',
    };

    this._reCaptchaV3 = {
      secretKey: '',
      passingScore: 0.4,
      url: 'https://www.google.com/recaptcha/api/siteverify',
    };

    this._hCaptcha = {
      secretKey: '',
      url: 'https://hcaptcha.com/siteverify',
    };
  }

  /**
   * @private
   */
  _getSecretKey(service = '') {
    const secretKey = this[service].secretKey;

    if (!secretKey) {
      throw new Error(`Secret key for ${service} was not passed`);
    }

    return secretKey;
  }

  /**
   * This method configurates the verifier config
   *
   * @param {Object} params - Config object
   * @returns {this}
   */
  config({
    reCaptchaV2SecretKey,
    reCaptchaV3SecretKey,
    reCaptchaV3PassingScore,
    hCaptchaSecretKey,
  } = params) {
    if (
      !reCaptchaV2SecretKey &&
      !reCaptchaV3SecretKey &&
      !hCaptchaSecretKey
    ) {
      throw new Error(
        `Secket keys aren't passed to either reCaptcha or hCaptcha`
      );
    }

    if (reCaptchaV2SecretKey) {
      this._reCaptchaV2.secretKey = reCaptchaV2SecretKey;
    }

    if (reCaptchaV3SecretKey) {
      this._reCaptchaV3.secretKey = reCaptchaV3SecretKey;
    }

    if (reCaptchaV3PassingScore) {
      this._reCaptchaV3.passingScore = reCaptchaV3PassingScore;
    }

    if (hCaptchaSecretKey) {
      this._hCaptcha.secretKey = hCaptchaSecretKey;
    }

    return this;
  }

  /**
   * @async
   * @private
   */
  async _verifier(service = '', token = '', ip = '', siteKey = '') {
    if (!token) {
      throw new Error('Captcha token is undefined');
    }

    const secretKey = this._getSecretKey(service);
    const url = this[service].url;
    const method = 'POST';

    const requestParams = { secret: secretKey, response: token };

    if (ip) {
      requestParams.ip = ip;
    }

    if (siteKey) {
      requestParams.siteKey = siteKey;
    }

    const body = stringifyParams(requestParams);

    const res = await fetch.do(url, { body, method });

    return this._getResult(res);
  }

  /**
   * @private
   */
  _getResult(captchaResponse = {}) {
    let captchaSuccess = captchaResponse.success;

    const captchaScope = captchaResponse.score;

    // If ReCaptcha 3
    if (captchaScope && captchaSuccess) {
      if (captchaScope < this._reCaptchaV3.passingScore) {
        captchaSuccess = false;
      }
    }

    const result = [captchaSuccess, captchaResponse];

    return result;
  }

  /**
   * This method does reCaptcha V2 token verification
   *
   * @param {string} token - The verification token you received when the user completed the captcha on your site
   * @param {string} [ip=''] ip - The optional user's IP address
   * @returns {<Promise>Array} -
   */
  reCaptchaV2(token = '', ip = '') {
    return this._verifier(reCaptchaV2, token, ip);
  }

  /**
   * This method does reCaptcha V3 token verification
   *
   * @param {string} token - The verification token you received when the user completed the captcha on your site
   * @param {string} [ip=''] ip - The optional user's IP address
   * @returns {<Promise>Array} -
   */
  reCaptchaV3(token = '', ip = '') {
    return this._verifier(reCaptchaV3, token, ip);
  }

  /**
   * This method does hCaptcha V1 token verification
   *
   * @param {string} token - The verification token you received when the user completed the captcha on your site
   * @param {string} [ip=''] ip - The optional user's IP address
   * @param {string} [siteKey=''] - The optional sitekey you expect to see
   * @returns {<Promise>Array} -
   */
  hCaptcha(token = '', ip = '', siteKey = '') {
    return this._verifier(hCaptcha, token, ip, siteKey);
  }
}

module.exports = new Verifier();
