require("dotenv").config();

const connectToMongo = require("./db");
const express = require('express')
const users = require('./Routes/auth')
const notes = require('./Routes/notes')
const cors = require('cors')

connectToMongo()

const app = express()
const port = process.env.PORT || 5000
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth',users)
app.use('/api/notes',notes)

app.listen(port, () => {
  console.log(`Cloud Notes backend listening on port ${port}`)
})