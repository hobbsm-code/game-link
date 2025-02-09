import User from "../models/User.js";
import { signToken, AuthenticationError } from "../services/auth.js";

interface LoginUserArgs {
    username: string;
    password: string;
}

interface AddUserArgs {
    input: {
        username: string;
        password: string;
    }
}

interface SaveGameArgs {
    input: {
        id: string;
        title: string;
        thumbnail: string;
        short_description: string;
        game_url: string;
        genre: string;
        platform: string;
        time_played: number;
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
        login: async (_parent: any, { username, password }: LoginUserArgs) => {
            const user = await User.findOne({ username });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user.username, user.password, user._id);

            return { token, user };
        },
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create(input);

            if (!user) {
                throw new AuthenticationError('Something is wrong!');
            }
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        },
        saveGame: async (_parent: any, { input }: SaveGameArgs, context: any) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedGames: input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Cannot save game');
            }
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