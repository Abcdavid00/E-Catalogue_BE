import { DataSource, DataSourceOptions } from "typeorm";

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
const DB_NAME = process.env.DB_NAME || 'users';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
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
    migrations: [__dirname + '/../migrations/**/*.{js,ts}'],
    migrationsRun: true,
};

const datasource = new DataSource(mysqlConfig)

export default datasource;