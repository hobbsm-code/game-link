import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const getSingleUser = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  return res.json(foundUser);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  if (!user) {
    return res.status(400).json({ message: 'Something is wrong!' });
  }
  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(req.body.password);

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }
  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};

export const saveGame = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { savedGames: req.body } },
        { new: true, runValidators: true }
        );
    return res.json(updatedUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { savedGames: { game_id: req.params.gameId } } },
        { new: true }
        );
    return res.json(updatedUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};
