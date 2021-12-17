const { URLSearchParams } = require('url');

/**
 * This function does stringify params to a string
 *
 * @param {Object} paramsObject - Params object
 * @returns {string} String with stringifed params
 */
const stringifyParams = (paramsObject = {}) => {
  const params = new URLSearchParams();

  const keys = Object.keys(paramsObject);

  keys.forEach((key) => params.append(key, paramsObject[key]));

  const stringParams = params.toString();

  return stringParams;
};

module.exports = stringifyParams;
