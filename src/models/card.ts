import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

interface ICard extends Document {
  name: 'string';
  link: 'string';
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Пожалуйста, укажите корректную ссылку в поле "link"',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>('card', cardSchema);
