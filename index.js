// import dotenv
require('dotenv').config()

// import express
const {SESSION_SECRET} = process.env
const express = require('express')
const path = require('path')
const session = require("express-session");
const flash = require("express-flash")
const passport = require("./utils/passport.js")

// import user router
const user = require('./routers/users.router')
const dashboard = require('./routers/dashboards.router')
const createRoom = require('./routers/create-room.router')

// buat app dari express
const app = express()

// gunakan middleware express.json dan express.urlencoded
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

// configure template engine using ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/images',express.static('./views/images'))

// gunakan user router sebagai middleware
app.use(user)

// gunakan dasshboard router sebagai middleware
app.use(dashboard)
app.use(createRoom)

// error handling
app.use((err, req, res, next) => {
    console.log(err);
    const {message, code = 500, error ="internal server error"} = err;

    return res.status(code).json({
        message,
        code,
        error
    });
})

// app listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server load with port: ${PORT}`)
})