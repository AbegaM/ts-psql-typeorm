import { users } from "../entities/user.entity";
import { createConnection } from "typeorm";

//TODO: get the db configs from environment variable
export const connection = createConnection({
    type: 'postgres', 
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'ts-psql',
    entities: [users],
    synchronize: true,
    logging: false
})