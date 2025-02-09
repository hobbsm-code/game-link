import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
  addUser(input: $input) {
    token
    user {
      _id
      username
      email
      password
      savedGames {
        gameId
        authors
        description
        title
        image
        link
      }
    }
  }
}
`;

export const SAVE_GAME = gql`
  mutation saveGame($input: GameInput!) {
    saveGame(input: $input) {
      _id
      username
      email
      gameCount
      savedGames {
        gameId
        publisher
        short_description
        title
        thumbnail
        genre
        platform
        developer
        release_date
        freetogame_profile_url
    }
  }
}
`;

export const REMOVE_GAME = gql`
  mutation removeGame($gameId: ID!) {
    removeGame(gameId: $gameId) {
      _id
      savedGames {
        gameId
      }
    }
  }
`;
