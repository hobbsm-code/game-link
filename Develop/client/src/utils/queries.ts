import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      gameCount
      savedGames {
        id
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
      id
      title
      totalTimePlayed
    }
  }
`;

export const GET_FREE_GAMES = gql`
  query getFreeGames ($category: String!) {
    getFreeGames (category: $category)  {
      id
      title
      thumbnail
      short_description
      genre
      publisher
      freetogame_profile_url
    }
  }
`;
