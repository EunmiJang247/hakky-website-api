const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

    S3_ACCESS_KEY_ID: Joi.string().required().description('S3 access key id'),
    S3_SECRET_ACCESS_KEY: Joi.string().required().description('S3 secret access key'),
    S3_REGION: Joi.string().required().description('S3 region'),
    S3_BUCKET: Joi.string().required().description('S3 bucket'),

    TOSS_PAYMENT_SECRET: Joi.string().required().description('Toss secret'),

    ALIGO_API_KEY: Joi.string().required().description('aligo secret'),
    ALIGO_URL: Joi.string().required().description('aligo api url'),
    ALIGO_USER_ID: Joi.string().required().description('aligo user id'),
    ALIGO_PHONE_NUMBER: Joi.string().required().description('aligo phone number'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    // url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    url: `${envVars.MONGODB_URL}v1`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  s3: {
    accessKeyId: envVars.S3_ACCESS_KEY_ID,
    secretAccessKey: envVars.S3_SECRET_ACCESS_KEY,
    region: envVars.S3_REGION,
    bucket: envVars.S3_BUCKET,
  },
  toss: envVars.TOSS_PAYMENT_SECRET,
  aligo: {
    apiKey: envVars.ALIGO_API_KEY,
    url: envVars.ALIGO_URL,
    phoneNumber: envVars.ALIGO_PHONE_NUMBER,
    userId: envVars.ALIGO_USER_ID,
  },
};
