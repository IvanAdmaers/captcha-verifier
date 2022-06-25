import { URLSearchParams } from 'url';

/**
 * This function does stringify params to a string
 */
const stringifyParams = (paramsObject: object): string => {
  const params = new URLSearchParams();

  const keys = Object.keys(paramsObject);

  keys.forEach((key) =>
    params.append(key, paramsObject[key as keyof typeof paramsObject])
  );

  const stringParams = params.toString();

  return stringParams;
};

export default stringifyParams;
