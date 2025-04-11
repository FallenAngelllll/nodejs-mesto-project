import dotenv from 'dotenv';

dotenv.config();

const {
  PORT = '3000',
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

export default {
  port: +PORT,
  mongoUrl: MONGO_URL,
};
