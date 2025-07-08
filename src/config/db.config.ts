import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';

import User from '../models/user.model';
import UserRole from '../models/userRole.model';
import Role from '../models/role.model';
import Note from '../models/notes.model';
import RefreshToken from '../models/refreshToken.model';

const env = process.env.NODE_ENV || 'development';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

const sequelize = new Sequelize({
    database: dbName,
    username: dbUser,
    password: dbPass || '',
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: env !== 'production' ? console.log : false, // Set to true for debugging
    models: [User, Role, UserRole, RefreshToken, Note], // Register models
});

// sequelize.addModels([User, Role, UserRole]);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database connected (${env})`);
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

export default sequelize;