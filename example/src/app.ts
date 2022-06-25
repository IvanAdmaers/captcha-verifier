import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

// Captcha Verifier
import verifier from 'captcha-verifier';

dotenv.config({ path: path.resolve('./.env') });

// Env
const {
  PORT,
  RECAPTCHA_2_PUBLIC_KEY,
  HCAPTCHA_PUBLIC_KEY,
  RECAPTCHA_3_PUBLIC_KEY,
  RECAPTCHA_2_SECRET_KEY,
  RECAPTCHA_3_SECRET_KEY,
  HCAPTCHA_SECRET_KEY,
} = process.env;

verifier.config({
  reCaptchaV2SecretKey: RECAPTCHA_2_SECRET_KEY,
  reCaptchaV3SecretKey: RECAPTCHA_3_SECRET_KEY,
  reCaptchaV3PassingScore: 0.4,
  hCaptchaSecretKey: HCAPTCHA_SECRET_KEY,
});

// The application settings
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));
app.use(express.static(path.resolve('./src/public')));

// Routes
app.get('/', (req: Request, res: Response) =>
  res.render('index.ejs', {
    reCaptcha2PublicKey: RECAPTCHA_2_PUBLIC_KEY,
    hCaptchaPublicKey: HCAPTCHA_PUBLIC_KEY,
    reCaptcha3PublicKey: RECAPTCHA_3_PUBLIC_KEY,
  })
);

// ReCaptcha 2
app.post('/recaptcha2', async (req: Request, res: Response) => {
  const { token } = req.body;

  const [success, response] = await verifier.reCaptchaV2(token, req.ip);

  return res.json({ success, response });
});

// hCaptcha
app.post('/hcaptcha', async (req: Request, res: Response) => {
  const { token } = req.body;

  const [success, response] = await verifier.hCaptcha(
    token,
    req.ip,
    HCAPTCHA_PUBLIC_KEY
  );

  return res.json({ success, response });
});

// ReCaptcha 3
app.post('/recaptcha3', async (req: Request, res: Response) => {
  const { token } = req.body;

  const [success, response] = await verifier.reCaptchaV3(token, req.ip);

  return res.json({ success, response });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} 🚀`);
});
