import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';


import cors from 'cors';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;

  const app = express();


// ✅ Enable CORS to allow frontend requests
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend access
  credentials: true,  // Allow cookies/auth headers
  methods: 'GET,POST,PUT,DELETE,OPTIONS'
}));

  // app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

 

  app.get('/api/games', async (req:Request, res:Response) => {
    try {
      
      const response = await fetch(`https://www.freetogame.com/api/games?category=${req.query.category}`);
      const data = await response.json();
      res.json(data);
      
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });



  

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
