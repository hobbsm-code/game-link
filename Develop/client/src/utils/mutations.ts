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
  mutation removeGame($id: ID!) {
    removeGame(id: $id) {
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

export const SUBMIT_PLAYTIME = gql`
  mutation submitPlaytime($id: ID!, $hours: Float!) {
    submitPlaytime(id: $id, hours: $hours) {
      id
      time_played
    }
  }
`;

