import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js'; 

interface LoginUserArgs {
    email: string;
    password: string;
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface SaveGameArgs {
    input: {
        
        gameId: string;
        publisher: string;
        short_description: string;
        title: string;
        thumbnail: string;
        genre: string;
        platform: string;
        developer: string;
        release_date: string;
        freetogame_profile_url: string;
    }
}

interface RemoveGameArgs {
    gameId: string;
}

export const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .populate('savedGames')
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            try {
            console.log("Received signup data:", input);
            const user = await User.create({ ...input });
            console.log("User created successfully:", user);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
            }
            catch (err) {
                console.error("Signup error:", err);
            throw new Error ("Error creating user");
            }
        },

        saveGame: async (_parent: any, { input }: SaveGameArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedGames: input } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeGame: async (_parent: any, { gameId }: RemoveGameArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedGames: { gameId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

export default resolvers;