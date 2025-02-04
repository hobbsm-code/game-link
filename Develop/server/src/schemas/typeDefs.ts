const typeDefs = `
    input BookInput {
        authors: [String]
        description: String
        title: String
        bookId: ID!
        image: String
        link: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
        savedBooks: [BookInput]
    }

    type Book {
        bookId: ID
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
        bookCount: Int
        savedBooks: [Book]
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
        saveBook(input: BookInput): User
        removeBook(bookId: ID!): User
    }
`;

export default typeDefs;