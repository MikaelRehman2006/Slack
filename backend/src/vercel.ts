import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { simpleResolvers as resolvers } from './simple-resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server for Vercel
const server = new ApolloServer({
  schema,
  plugins: [],
});

// Initialize the server
let serverStarted = false;

const initServer = async () => {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GraphQL endpoint
app.use('/api/graphql', 
  cors<cors.CorsRequest>({
    origin: ['http://localhost:3000', 'https://*.vercel.app', 'https://*.vercel.com'],
    credentials: true,
  }),
  express.json(),
  async (req, res, next) => {
    await initServer();
    return expressMiddleware(server)(req, res, next);
  }
);

// Export the Express app as a Vercel serverless function
export default app;
