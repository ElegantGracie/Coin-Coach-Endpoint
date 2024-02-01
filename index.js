const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { routemanager } = require('./routes/route')
const cookieParser = require('cookie-parser')

// Instance of express
const app = express()
dotenv.config()
// port
const port = process.env.PORT || 3000

// middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api', routemanager)

// testing
app.get('/', (_, res) => {
  res.json({message: 'hello world'})
})

// server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`) 
})