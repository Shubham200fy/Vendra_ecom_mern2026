const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'})
}

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
         if(existingUser) {
            return res.status(400).send({ message: "User already exist"})
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         const user = await User.create({ name, email, password:hashedPassword });
         if(user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Welcome to Vendra, ${name}. 
            Thank you registring with us. We are excited to have you on board
            You OTP for vendra registration is: ${otp}`;

            await sendEmail(email, 'Welcome to Vendra - Your OTP for Registration', message);
            res.status(201).json({
                _id: user._id, 
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
         
    } catch (err) {
        res.status(400).json({ mesage: err});         
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })        
        } else {
            res.status(400).json({ message: 'Invalid email or password'})
        }
    } catch (err) {
        res.status(500).json({ message: err})
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err});
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers
}