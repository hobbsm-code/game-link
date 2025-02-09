import { Schema, type Document } from 'mongoose';

export interface GameDocument extends Document {
<<<<<<< HEAD
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
=======
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
>>>>>>> 139aa79e068b36e95b48b1875ce7814e7b6ea5f6
  title: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
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
});

export default gameSchema;
=======
});

export default gameSchema;
>>>>>>> 139aa79e068b36e95b48b1875ce7814e7b6ea5f6
