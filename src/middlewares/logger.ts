import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

const requestLogFile = path.join(__dirname, 'logs', 'request.log');
const errorLogFile = path.join(__dirname, 'logs', 'error.log');

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: requestLogFile,
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  meta: true,
  msg: '{{req.method}} {{req.url}}',
  expressFormat: true,
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: errorLogFile,
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  meta: true,
});
