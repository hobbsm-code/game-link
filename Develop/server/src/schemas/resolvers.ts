
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
        id: string;
        title: string;
        thumbnail: string;
        short_description: string;
        game_url: string;
        genre: string;
        publisher: string;
        developer: string;
        release_date: string;
        freetogame_profile_url: string;
        time_played: number;
        }
}

interface RemoveGameArgs {
    id: string;
}

interface SubmitPlaytimeArgs {
    id: string;
    hours: number;
}
 interface LeaderboardEntry {
    username: string;
    id: string;
    title: string;
    totalTimePlayed: number;
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
        
        getLeaderboard: async () => {
            const users = await User.find().select('username savedGames');
        
            const leaderboard: LeaderboardEntry[] = [];
        
            users.forEach(user => {
                user.savedGames.forEach(game => {
                    leaderboard.push({
                        username: user.username,
                        id: game.id,
                        title: game.title,
                        totalTimePlayed: parseFloat((game.time_played || 0).toFixed(2))
                    });
                });
            });
        
            // Sort leaderboard by highest total playtime per game
            leaderboard.sort((a, b) => b.totalTimePlayed - a.totalTimePlayed);
        
            // Return top 10 players
            return leaderboard.slice(0, 10);
        },

        getFreeGames: async (_parent:any, args:{category:string} ) => {
            try {
                const  category  = args?.category;
                if (!category) {
                    throw new Error('Category is required');
                  }
                //   call external API
                const response = await fetch(`https://www.freetogame.com/api/games?category=${category}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch games: ${response.status}`);}
                const data = await response.json();
                console.log("🎮 Raw API Response:", data);

                const games = data.map((game: any) => ({
                    id: game.id,
                    title: game.title,
                    short_description: game.short_description,
                    thumbnail: game.thumbnail,
                    game_url: game.game_url,
                    genre: game.genre,
                    publisher: game.publisher,freetogame_profile_url: game.freetogame_profile_url
                }));
                
            
                return games;
        }
        catch (err) {
            console.error("🔴 Failed to fetch games:", err);
            return err;
        }
    }
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
            if (!input.id) {
                console.error("❌ id is missing, cannot save game:", input);
                throw new Error("Game id is required to save the game.");
            }
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

        submitPlaytime: async (_parent: any, { id, hours }: SubmitPlaytimeArgs, context: any) => {
            if (!context.user) throw new AuthenticationError('You must be logged in');
        
            console.log("✅ User:", context.user._id);
            console.log("🎮 Game ID:", id);
            console.log("⏳ Adding playtime:", hours, "hours");
        
            const user = await User.findOne({ _id: context.user._id, "savedGames.id": id });
        
            if (!user) {
                console.error("❌ Game not found in savedGames or user does not exist.");
                throw new Error('Game not found or user does not exist.');
            }
        
            // Find the game in `savedGames`
            const gameIndex = user.savedGames.findIndex(game => game.id === id);
            if (gameIndex === -1) {
                console.error("❌ Game not found in user's saved games.");
                throw new Error('Game not found.');
            }
        
            const updatedTimePlayed = parseFloat(((user.savedGames[gameIndex].time_played || 0) + hours).toFixed(2));

            user.savedGames[gameIndex].time_played = updatedTimePlayed;
            await user.save();

            return user.savedGames[gameIndex];
            },
        
        

        removeGame: async (_parent: any, { id }: RemoveGameArgs, context: any) => {
            if (!context.user) {
              throw new AuthenticationError('Not logged in');
            }
          
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedGames: { id: id } } },
              { new: true }
            );
          
            if (!updatedUser) {
              throw new Error('Failed to remove game');
            }
          
            return updatedUser;
          },
    }
};

export default resolvers;