import { Schema, type Document } from 'mongoose';

export interface GameDocument extends Document {
  gameId: string;
  title: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
  id: number;
  thumbnail: string;
  category: string;
  time_played: number;
}

const gameSchema = new Schema<GameDocument>({
  gameId: {
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
  game_url: {
    type: String,
  },
  genre: {
    type: String,
  },
  platform: {
    type: String,
  },
  publisher: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
  },
  release_date: {
    type: String,
  },
  freetogame_profile_url: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  time_played: {
    type: Number,
    default: 0,
  },
});

export default gameSchema;