
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//importojme modelin per nderveprimin me db
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400);
        throw new Error('User Exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201);
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //kontrollojme nese fushat jane bosh
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    //kontrollojme nese useri ekziston ne db
    const user = await User.findOne({ email });

    //krahaso nese useri ekziston dhe passwordi nga req.body me passwordin ne db
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invalid data');
    }
})



const getCurrentUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Current user data' })
})

module.exports = { registerUser, loginUser, getCurrentUser }
