import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// @ts-ignore
export const AppDataSource = new DataSource({
    type: isProduction ? 'postgres' : 'sqlite',

    ...(isProduction
        ? {
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        }
        : {
            database: isTest ? 'test.sqlite' : 'db.sqlite',
        }),

    synchronize: false,
    logging: false,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/**/migrations/*.js'],

    // entities: [
    //     isProduction
    //         ? 'dist/**/*.entity.js'
    //         : 'src/**/*.entity.ts'
    // ],
    //
    // migrations: [
    //     isProduction
    //         ? 'dist/migrations/*.js'
    //         : 'src/migrations/*.ts',
    // ],
});