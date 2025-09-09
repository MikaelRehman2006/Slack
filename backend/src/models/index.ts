import { Sequelize } from 'sequelize-typescript';
import { Room } from './Room';
import { Message } from './Message';
import { User } from './User';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://slack_user:slack_password@localhost:5432/slack_graphql', {
  dialect: 'postgres',
  models: [Room, Message, User],
  logging: process.env.NODE_ENV === 'development',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
});

export { sequelize, Room, Message, User };
