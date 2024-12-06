import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config(); 

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  logging: false, // To ease debugging, you can enable logging in Sequelize. 
  // This is done by setting the logging option to a function that gets executed every time Sequelize needs to log something.
});

export default sequelize;