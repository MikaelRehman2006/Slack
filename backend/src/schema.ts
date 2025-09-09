import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Message {
    id: ID!
    roomId: ID!
    userId: ID!
    body: String!
    createdAt: String!
    user: User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    createdAt: String!
  }

  type Room {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    messages: [Message!]!
  }

  type Query {
    messages(roomId: ID!, limit: Int = 50, before: String): [Message!]!
    rooms: [Room!]!
    users: [User!]!
  }

  type Mutation {
    sendMessage(roomId: ID!, body: String!, userId: ID!): Message!
    createRoom(name: String!, description: String): Room!
  }

  type Subscription {
    messageAdded(roomId: ID!): Message!
  }
`;
