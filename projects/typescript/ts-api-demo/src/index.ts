import express from "express"
import { getUsers, getUser, createUser } from "./routes/users"

const app = express()
app.use(express.json())

app.get('/users', getUsers)
app.get('/users/:id', getUser)
app.post('/users', createUser)

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})