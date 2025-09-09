import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($roomId: ID!, $limit: Int) {
    messages(roomId: $roomId, limit: $limit) {
      id
      body
      userId
      roomId
      createdAt
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      description
      createdAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      avatar
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($roomId: ID!, $body: String!, $userId: ID!) {
    sendMessage(roomId: $roomId, body: $body, userId: $userId) {
      id
      body
      userId
      roomId
      createdAt
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription MessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      body
      userId
      roomId
      createdAt
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!, $description: String) {
    createRoom(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;
