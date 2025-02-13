import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      gameCount
      savedGames {
        gameId
        title
        short_description
        thumbnail
        genre
        game_url
        freetogame_profile_url
        platform
        time_played
      }
  }
}
`;

export const GET_LEADERBOARD = gql`
  query getLeaderboard {
    getLeaderboard {
      username
      gameId
      title
      totalTimePlayed
    }
  }
`;
