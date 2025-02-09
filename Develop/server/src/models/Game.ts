import { Schema, type Document } from 'mongoose';

export interface GameDocument extends Document {
  id: string;
  title: string;
  short_description: string;
  thumbnail: string;
  genre: string;
  game_url: string;
  platform: string;
  time_played: number;
}

const gameSchema = new Schema<GameDocument>({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  game_url: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  time_played: {
    type: Number,
    default: 0,
    required: false,
  },
} as const);

export default gameSchema;