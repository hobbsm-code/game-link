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
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      gameCount
      savedGames {
        gameId
        publisher
        short_descriptiondescription
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
  mutation removeGame($bookId: ID!) {
    removeBook(gameId: $gameId) {
      _id
      username
      email
      gameCount
      savedGames {
        gameId
        publisher
        short_descriptiondescription
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
