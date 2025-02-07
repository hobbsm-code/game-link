import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

interface JwtPayload extends BaseJwtPayload {
  _id: unknown;
  username: string;
  password: string;
  email: string;
  
}


export const authenticateToken = (
  req: Request,
  res: Response,
  next: Function
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      const secretKey = process.env.JWT_SECRET_KEY || '';

      jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
              return res.sendStatus(403); // Forbidden
          }

          req.user = decoded as JwtPayload;
          return next();
      });
  } else {
      res.sendStatus(401); // Unauthorized
  }
};

export const signToken = (username: string, email: string, password: string, _id: unknown) => {
  // Create a payload with the user information
  const payload = { username, email, password, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
