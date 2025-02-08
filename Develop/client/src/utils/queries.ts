import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me{
    me {
      _id
      username
      email
      gameCount
      savedGames {
        gameId
        title
        short_description
        game_url
        genre
        platform
        publisher
        developer
        release_date
        freetogame_profile_url
        id
        thumbnail
      }
  }
}
`;