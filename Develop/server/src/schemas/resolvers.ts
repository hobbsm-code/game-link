import User from "../models/User.js";
import { signToken, AuthenticationError } from "../services/auth.js";

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
        title: string;
        short_description: string;
        game_url: string;
        genre: string;
        platform: string;
        publisher: string;
        developer: string;
        release_date: string;
        freetogame_profile_url: string;
        id: number;
        thumbnail: string;
        category: string;
        time_played?: number;
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

            const token = signToken(user.email, user.password, user._id);

            return { token, user };
        },
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            try {
                const user = await User.create(input);

                if (!user) {
                    throw new AuthenticationError('Something is wrong!');
                }
                const token = signToken(user.email, user.password, user._id);
                return { token, user };
            } catch (err) {
                console.error("Signup error:", err);
                throw new Error("Error creating user");
            }
        },
        saveGame: async (_parent: any, { input }: SaveGameArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedGames: input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Cannot save game');            
        },
        removeGame: async (_parent: any, { gameId }: RemoveGameArgs, context: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedGames: { game_id: gameId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new AuthenticationError('Cannot remove game');
            }
            return updatedUser;
        },
    },
};

export default resolvers;