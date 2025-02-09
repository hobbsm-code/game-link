import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const SAVE_GAME = gql`
  mutation saveGame($input: GameInput!) {
    saveGame(input: $input) {
      _id
      username
      email
      savedGames {
        id
        title
        short_description
        thumbnail
        genre
        game_url
        platform
        time_played
      }
    }
  }
`;

export const REMOVE_GAME = gql`
  mutation removeGame($gameId: ID!) {
    removeGame(gameId: $gameId) {
      _id
      username
      email
      savedGames {
        id
        title
        short_description
        thumbnail
        genre
        game_url
        platform
        time_played
      }
    }
  }
`;
