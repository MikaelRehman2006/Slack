import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema';
import { simpleResolvers } from './simple-resolvers';
import { redisClient } from './redis';

const app = express();
const httpServer = createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers: simpleResolvers });

// Use WebSocket server with GraphQL
const serverCleanup = useServer({ schema }, wsServer);

// Create Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const start = async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    
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
      console.log(`🔌 WebSocket server ready at ws://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
