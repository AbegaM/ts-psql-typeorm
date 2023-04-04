# Typescript, TypeORM, PSQL Server

### Goal

- Build a basic CRUD server by using the following technologies
  1. Typescript
  2. NodeJs
  3. TypeORM
  4. PSQL DB

### Steps

1. Initialize a Nodejs project

   ```
   npm init -y
   ```

2. Install ExpressJS

   ```
   npm i express
   ```

3. Install a package called `ts-node`

   ```
   npm i ts-node
   ```

   - `ts-node` is a typescript **execution engine and REPD for nodeJS**, it transforms Typescript into Javascript enabling you to directly execute Typescript on NodeJS with out precompiling, This is accomplished by hooking node's module loading APIs enabling it to be used seamlessly alongside other Node.js tools and libraries.

4. Install typeorm, pg, reflect-metadata

   ```
   npm i typeorm pg reflect-metadata typescript @types/express @types/cors cors
   ```

5. Add a start script in your `package.json` file

   ```
   "start": "node index.ts"
   "start:dev": "nodemon index.ts"
   ```

6. **Add Entity**

   - Entities are the structure of the tables which we are going to store in the database, we will build a user entity

     ```ts
     import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
     @Entity()
     export class users {
       @PrimaryGeneratedColumn()
       id: number;
       @Column()
       name: string;
       @Column()
       email: string;
     }
     ```

     The above class will define our table structure for the PSQL table, its like a mongoose schema for MongoDB

   - You will see warning for the typeorm decorators so add this two lines in `tsconfig` file

     ```json
     {
       "compilerOptions": {
         "types": [],
         "emitDecoratorMetadata": true,
         "experimentalDecorators": true
       }
     }
     ```

7. **Create a connection between the database and typeorm**

   - Create a folder called `connection` and create a file `connection.ts` in that folder

     ```ts
     import { users } from "../entities/users";
     import { createConnection } from "typeorm";
     export const connection = createConnection({
       type: "postgres",
       host: "localhost",
       port: 5432,
       username: "postgres",
       password: "1234",
       database: "demo",
       entities: [users],
       synchronize: true,
       logging: false,
     });
     ```

   - Import the `connection.ts` file in your root `index.ts` file and initialize the connection, inside connection to access users table typeorm has a method called `getRepository`, we can access all of the entities via the repository

     ```ts
     import * as express from "express";
     import { connection } from "./connection/connection";
     import * as cors from "cors";
     const app = express();
     app.use(cors());
     app.use(express.json());
     const server = app.listen(3000, () => {
       console.log("server running at 3000....");
     });
     app.get("/api", (req, res) => {
       res.send("Welcome to API");
     });
     connection
       .then(async (connection) => {
         console.log("connected");

         const usersRepository = connection.getRepository(users);
       })
       .catch((error) => {
         console.log(error);
       });
     ```

8. Create a datbase in your PSQL DB

   ```
   db name = ts-psql
   ```

9. **Add CRUD operations**

   - **GET**

     ```ts
     app.get(
       "/api/users",
       async(
         app.get("/api/users", async (req, res) => {
           const users = await usersRepository.find();
           res.send(users);
         })
       )
     );
     ```

   - **Find One**

     ```ts
     app.get("/api/users/:id", async (req, res) => {
       const user = await usersRepository.findOne({
         where: { id: +req.params.id },
       });
       res.json({
         message: "success",
         payload: user,
       });
     });
     ```

   - **POST**

     ```ts
     app.post("/api/users", async (req, res) => {
       console.log("body", req.body);
       const user = await usersRepository.create(req.body);
       const results = await usersRepository.save(user);
       res.json({
         message: "success",
         payload: results,
       });
     });
     ```

   - **DELETE**

     ```ts
     app.delete("/api/users/:id", async (req, res) => {
       const user = await usersRepository.delete(req.params.id);
       res.json({
         message: "success",
       });
     });
     ```

   - **PUT**

     ```ts
     app.put("/api/users/:id", async (req, res) => {
       const user = await usersRepository.findOne({
         where: { id: +req.params.id },
       });
       usersRepository.merge(user, req.body);
       const result = await usersRepository.save(user);
       res.json({
         message: "success",
         payload: result,
       });
     });
     ```

### Note

1. Adding a `+` sign before a `string` changes it to a number

   ```ts
   const user = await usersRepository.findOne({
     where: { id: +req.params.id },
   });
   ```

### Questions

1. What does the `reflect-metadata`, `ts-node` package do ?

### Issues

1. Implementing the API calls inside the `connection` setup is not a good practice
2. There is no error handling logic in the API calls and it needs to be improved
3. The db configs have to be isolated to an environment variable
