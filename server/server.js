const express = require('express')
const session = require('express-session')
const {check, validationResult} = require('express-validator')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10)
require('./models/userModel')

const app = express()

/**
 * Corse middleware for communication with different URL
 */
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

/**
 * Middleware for parsing json body content
 */
app.use(express.json())

/**
 * To do:
 * Please provide valid MongoDB connection link, or let me know your IP address so I can whitelisted that address and you can login to y DB
 */
const mDB_URI = ""

/**
 * Connecting to the DB server
 */
async function connectDB ()
{
    try {
        await mongoose.connect(mDB_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error(error)
    }
}
connectDB()

const CurrentUser = mongoose.model('User')

/**
 * Setup session to be able to login users
 */
app.use(session({
    name: "TEST_APP_SESSION",
    secret: "something to sign a session",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    },
}))

/**
 * Logout route
 */
app.get('/logout', (req, res) =>
{
    req.session.destroy((err) =>
    {
        if (err) {
            res.send(JSON.stringify({'status': 'Error', 'messages': [{msg: err}], 'user': {}}))
        } else {
            res.send(JSON.stringify({'status': 'SUCCESS', 'messages': {}, 'user': {}}))
        }

    })
})

/**
 * Home route
 */
app.get('/', async (req, res) =>
{
    if (req.session.usr && req.session.usr != '') {
        let user = null
        await CurrentUser.findOne({email: req.session.usr})
            .then((data) =>
            {
                user = data
            })

        if (user) {
            res.send(JSON.stringify({'status': 'SUCCESS', 'messages': [{}], 'user': {first_name: user.first_name, last_name: user.last_name, email: user.email}}))
        }
    } else {
        res.send(JSON.stringify({'status': 'SUCCESS', 'messages': {}, 'user': {}}))
    }
})

/**
 * Login route
 */
app.post('/login', [
    check('email')
        .not().isEmpty().withMessage('Email can\'t be empty').bail()
        .isEmail().withMessage('Email is not valid'),
    check('password')
        .not().isEmpty().withMessage('Password can\'t be empty')
], async (req, res) =>
{
    const {email, password} = req.body

    let checkResult = validationResult(req)

    if (checkResult.errors && checkResult.errors.length != 0) {
        res.send(JSON.stringify({'status': 'Error', 'messages': checkResult.errors, 'user': {}})).end()
    } else {
        let existingUser = null

        await CurrentUser.findOne({email})
            .then((result) =>
            {
                existingUser = result
            })

        if (existingUser && existingUser.email) {
            let isAuth = bcrypt.compareSync(password, existingUser.password)

            if (isAuth) {
                req.session.usr = existingUser.email
                res.send(JSON.stringify({'status': 'SUCCESS', 'messages': {}, 'user': {first_name: existingUser.first_name, last_name: existingUser.last_name}}))
            } else {
                res.send(JSON.stringify({'status': 'Error', 'messages': [{msg: 'Email and Password don\'t match'}], 'user': {}}))
            }
        } else {
            res.send(JSON.stringify({'status': 'Error', 'messages': [{msg: 'Email and Password don\'t match'}], 'user': {}}))
        }
    }
})

/**
 * Register route
 */
app.post('/register', [
    check('first_name')
        .trim().escape()
        .not().isEmpty().withMessage('First name can\'t be empty'),
    check('last_name')
        .trim().escape()
        .not().isEmpty().withMessage('Last name can\'t be empty'),
    check('email')
        .not().isEmpty().withMessage('Email can\'t be empty').bail()
        .isEmail().withMessage('Email is not valid'),
    check('password')
        .not().isEmpty().withMessage('Password can\'t be empty').bail()
        .isLength({min: 6}).withMessage('Password length must be at least 6 characters long'),
    check('confirm_password')
        .not().isEmpty().withMessage('Confirm Password can\'t be empty').bail()
        .trim().escape()
        .isLength({min: 6}).withMessage('Confirm Password length must be at least 6 characters long').bail()
        .custom((value, {req}) => (value === req.body.password)).withMessage('Confirm Password and Password do not match')
], async (req, res) =>
{
    const {first_name, last_name, email, password} = req.body

    let checkResult = validationResult(req)

    if (checkResult.errors && checkResult.errors.length != 0) {
        res.send(JSON.stringify({'status': 'Error', 'messages': checkResult.errors, 'user': {}}))
    } else {
        let encryptedPassword = bcrypt.hashSync(password, salt)

        let oldUser = null

        await CurrentUser.findOne({email})
            .then((result) =>
            {
                oldUser = result
            })

        if (oldUser !== null) {
            res.send(JSON.stringify({'status': 'Error', 'messages': [{msg: 'User with this email already exists'}], 'user': {}}))
        }

        try {
            CurrentUser.create({
                first_name,
                last_name,
                email,
                password: encryptedPassword
            }).then((data) =>
            {
                console.log(data)
                req.session.usr = data.email
                res.send(JSON.stringify({'status': 'SUCCESS', 'messages': [{msg: encryptedPassword}], 'user': {first_name: data.first_name, last_name: data.last_name, email: data.email}}))
            })
        } catch (error) {
            res.send({error: error})
        }
    }
})

/**
 * Start server application
 */
app.listen(5000, () =>
{
    console.log("Server started on http://localhost:5000")
})