const typeDefs = `#graphql
    input GameInput {
        authors: [String]
        description: String
        title: String
        gameId: ID!
        image: String
        link: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
        savedGames: [GameInput]
    }

    type Game {
        gameId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
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