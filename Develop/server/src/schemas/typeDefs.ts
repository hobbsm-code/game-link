
const typeDefs = `
    input GameInput {
        gameId: ID!
        title: String
        short_description: String
        game_url: String
        genre: String
        platform: String
        publisher: String
        developer: String
        release_date: String
        freetogame_profile_url: String
        id: Int
        thumbnail: String
        category: String
        time_played: Float
    }

    input UserInput {
        username: String!
        password: String!
        email: String!
        savedGames: [GameInput]
    }

    type Game {
        gameId: ID
        title: String
        short_description: String
        game_url: String
        genre: String
        platform: String
        publisher: String
        developer: String
        release_date: String
        freetogame_profile_url: String
        id: Int
        thumbnail: String
        category: String
        time_played: Float
    }

    type User {
        _id: ID
        username: String
        email: String
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
        login(email: String!, password: String!): Auth
        addUser(input: UserInput!): Auth
        saveGame(input: GameInput): User
        removeGame(gameId: ID!): User
    }
`;

export default typeDefs;