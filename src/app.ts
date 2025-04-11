import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import helmet from 'helmet';
import cors from 'cors';
import { errorLogger, requestLogger } from './middlewares/logger';
import limiter from './middlewares/rateLimiter';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import config from './config';

const server = express();

mongoose.connect(config.mongoUrl);

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(cookieParser());
server.use(limiter);
server.use(requestLogger);
server.use(routes);
server.use(errorLogger);
server.use(errors());
server.use(errorHandler);

server.listen(config.port);
