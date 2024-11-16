if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')

const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')
const app = express()
const dbUrl =  'mongodb+srv://dheerajdevnani2003:thalaforareason@cluster0.gwgvhll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database connected");
}
main().catch(err => console.log(err));

app.use(cors())

// middleware
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.send("Hello wprld")
})

app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)


// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).json({success: false, message: err.message}); //For development
})

const port =  8080
app.listen(port, (req, res) => {
    console.log('Listening to the port 8080');
})
