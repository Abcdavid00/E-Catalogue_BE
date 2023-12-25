import { DataSource, DataSourceOptions } from "typeorm";

const DB_HOST = process.env.DB_HOST;
const DB_PORT = +process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
export const mysqlConfig: DataSourceOptions = {
    type: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false,
    logging: true,
    migrations: [__dirname + '/../**/migrations/**/*.{js,ts}'],
    migrationsRun: true,
};

const datasource = new DataSource(mysqlConfig)

export default datasource;