import * as express from "express"
import * as cors from "cors"

import { connection } from "./db/connection"
import { users } from "./entities/user.entity"

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
    res.send('Welcome to API')
})


//TODO: improve the syntax below, setting up API calls inside the database connection is not a good practice
//TODO: implement error handling logic in all APIs
connection.then(async connection => {
    console.log("psql database connected")
    const usersRepository = connection.getRepository(users)

    //GET API
    app.get("/api/users", async (req, res) => {
        const users = await usersRepository.find()
        res.send(users)
    })

    //GET :/id
    app.get("/api/users/:id", async (req, res) => {
        //adding a + sign before a string changes the string to number ?
        const user = await usersRepository.find({ where: { id: +req.params.id } }) 
        res.json({message: "success", payload: user})
    })

    //POST API
    app.post("/api/users", async (req, res) => {
        const user = await usersRepository.create(req.body) 
        const result = await usersRepository.save(user)
        res.json({
            message: 'success', payload: result
        })
    })

    //PUT API
    app.put("/api/users/:id", async (req, res) => {
        const user = await usersRepository.findOne({where: {id: +req.params.id}})
        usersRepository.merge(user, req.body);
        const result = await usersRepository.save(user)
        res.json({message: 'success', payload: result})
    })

    //DELETE API 
    app.delete("/api/users/:id", async (req, res) => {
        const user = await usersRepository.delete(req.params.id)
        res.json({
            message: 'success'
        })
    })
}).catch(error => {
    console.error(error)
})

const PORT = 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})