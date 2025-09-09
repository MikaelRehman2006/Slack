import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema';
import { simpleResolvers } from './simple-resolvers';

const app = express();
const httpServer = createServer(app);

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers: simpleResolvers });

// Create Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

const start = async () => {
  try {
    // Start Apollo Server
    await server.start();
    
    // Apply middleware
    app.use('/graphql', 
      cors<cors.CorsRequest>({
        origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server)
    );

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // Start HTTP server
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
