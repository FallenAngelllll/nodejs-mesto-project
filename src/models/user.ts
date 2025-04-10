import mongoose, { Document } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
          'https://pictures.s3.yandex.net/resources/Untitled_-_2024-05-06T195257.404_1715003590.png',
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Пожалуйста, укажите корректную ссылку на аватар',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Недопустимый формат электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
