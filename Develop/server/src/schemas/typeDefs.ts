
const typeDefs = `
    input GameInput {
        id: ID!
        title: String
        thumbnail: String
        short_description: String
        game_url: String
        genre: String
        platform: String
        time_played: Float
    }

    input UserInput {
        username: String!
        password: String!
        email: String!
        savedGames: [GameInput]
    }

    type Game {
        id: ID
        title: String
        thumbnail: String
        short_description: String
        game_url: String
        platform: String
        genre: String
        time_played: Float
    }

    type User {
        _id: ID
        username: String
        gameCount: Int
        savedGames: [Game]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(input: UserInput!): Auth
        saveGame(input: GameInput): User
        removeGame(gameId: ID!): User
        saveGame(input: GameInput): User
        removeGame(gameId: ID!): User
    }
`;

export default typeDefs;