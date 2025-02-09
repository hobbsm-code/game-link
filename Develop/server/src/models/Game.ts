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
}

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const gameSchema = new Schema<GameDocument>({
  publisher: [
    {
      type: String,
    },
  ],
  short_description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  gameId: {
    type: String,
    required: true,
  },
  freetogame_profile_url: {
    type: String,
  },
  game_url: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

export default gameSchema;
