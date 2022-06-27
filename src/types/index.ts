export interface ICaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: Array<string>;
  score?: number;
  action?: string;
  credit?: boolean;
  score_reason?: Array<string>;
}
