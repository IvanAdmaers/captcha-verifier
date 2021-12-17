# Captcha verifier

Captcha verifying has never been so easy. Take a look on the live example:
[https://captcha-verifier.ivanadmaers.com/](https://captcha-verifier.ivanadmaers.com/)

![captcha-verifier logo](https://i.ibb.co/YDmmmbw/captcha-verifier-logo.jpg)

## Features

- 📦 Zero dependencies
- 🔌 Ease of use API
- 🔫 ES6 syntax
- 📝 MIT license
- ✅ Verify reCaptcha 2, reCaptcha 3, hCaptcha easy peasy  
and much more...


## Installation
```bash
# By npm:
npm i captcha-verifier
# By yarn:
yarn add captcha-verifier
```

## Usage

Configurate the config.

**Keep it on mind that if you need verify only reCaptcha 2 you don't necessary to set other keys for reCaptcha 3 or hCaptcha. Set keys only for captcha services that you will need to verify in your project**

```javascript
const verifier = require('captcha-verifier');
// import verifier from 'captcha-verifier';

verifier.config({
  reCaptchaV2SecretKey: 'YOUR_RECAPTCHA_V2_SECRET_KEY', // string
  reCaptchaV3SecretKey: 'YOUR_RECAPTCHA_V3_SECRET_KEY', // string
  reCaptchaV3PassingScore: 0.4, // optional. Number. 0.4 by default
  hCaptchaSecretKey: 'YOUR_HCAPTCHA_SECRET_KEY', // string
});
```

## API
If you need to verify reCaptcha V2:
```javascript
const [success, response] = await verifier.reCaptchaV2('token (client captcha response)', 'client IP');
```

If you need to verify reCaptcha V3:
```javascript
const [success, response] = await verifier.reCaptchaV3('token (client captcha response)', 'client IP');
```

If you need to verify hCaptcha:
```javascript
const [success, response] = await verifier.hCaptcha(
    'token (client captcha response)',
    'client IP',
    'HCAPTCHA_PUBLIC_KEY', // optional (https://docs.hcaptcha.com/#verify-the-user-response-server-side)
  );
```

Returns:
```javascript
[
  success: true|false, // boolean
  response: {}, // object
]
```

If you just need to make sure that the captcha was successfully solved by a human, not a robot, do somethig like this:
```javascript
const [success, response] = await verifier.reCaptchaV2('token (client captcha response)', 'client IP');

if (!success) {
  // actions for robots
}

// actions for humans
```

If you need to get some specific parameters from the captcha service, you can find it in the second array item.

```javascript
const [success, response] = await verifier.reCaptchaV3('token (client captcha response)', 'client IP');

if (!success || !response.hostname === 'localhost') {
  // do something for robots
}

// do something else for humans
```


## Notes

**reCaptchaV3PassingScore**

About the reCaptchaV3PassingScore paramete. It's an optional paramete that you may set if you verifies reCaptcha 3. After reCaptcha 3 verified your token (captcha response from client) you get a score param from 0 to 1. The higher the number, the more likely it is that the captcha was passed by a human, not a robot. So you can set a specific score that will give you success true result. 

Example:  

```javascript
verifier.config({
  reCaptchaV3SecretKey: 'YOUR_CAPTCHA_SECRET_KEY', // string
  reCaptchaV3PassingScore: 0.5, // number
});
```

```javascript
const [success, response] = await verifier.reCaptchaV3('token (client captcha response)', 'client ip');
```

If reCaptcha returns score 0.9 the success parament will be *true* because the returned number from reCaptcha is more to setted passing score in the config.

If reCaptcha returns score 0.2 the success parament will be *false* because the returned number from reCaptcha is less to setted passing score in the config.

If reCaptcha returns score 0.5 the success parament will be *true* because the returned number from reCaptcha is equals to setted passing score in the config.

response score < setted in config score = *false*  
response score = setted in config score = *true*  
response score > setted in config score = *true*

## Contributing

```bash
# Clone the package

# Run:
npm ci i

cd /example

npm ci i

npm run dev
```

Any ideas for improvement this package are always welcome!

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Ivan Admaers
