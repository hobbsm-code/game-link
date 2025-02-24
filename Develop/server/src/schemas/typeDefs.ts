
const typeDefs = `#graphql
    input GameInput {
    id: ID
    title: String
    thumbnail: String
    short_description: String
    game_url: String
    genre: String
    
    publisher: String
    developer: String
    release_date: String
    freetogame_profile_url: String
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
    short_description: String
    game_url: String
    genre: String
    platform: String
    publisher: String
    developer: String
    release_date: String
    freetogame_profile_url: String
    thumbnail: String
    time_played: Float
}
    type User {
        _id: ID
        username: String
        email: String
        gameCount: Int
        savedGames: [Game]
        time_played: Float
    }

    type Auth {
        token: ID!
        user: User
    }

    type LeaderboardEntry {
    username: String
    id: String
    title: String
    totalTimePlayed: Float
}

    type Query {
        me: User
        getLeaderboard: [LeaderboardEntry]
        getFreeGames (category:String!): [Game]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(input: UserInput!): Auth
        saveGame(input: GameInput): User
        removeGame(id: ID!): User
        submitPlaytime(id: ID!, hours: Float): Game
        
    }
`;

export default typeDefs;