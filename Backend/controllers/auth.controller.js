const userModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
};

async function registerUser(req, res){
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isUserAlreadyExists = await userModel.findOne({ 
            $or: [{ username }, { email }]
        });

        if(isUserAlreadyExists){
            return res.status(400).json({ message: 'Acount with this Username or email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,    
            }
        });

    }catch(error){
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }    
    
};

async function loginUser(req, res){
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
            }
        });

    }catch(error){
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function logoutUser(req, res){

    const token = req.cookies.token;

    if(token){
        await blacklistModel.create({ token });
    }

    res.clearCookie('token', cookieOptions);

    res.status(200).json({ message: 'User logged out successfully' });
};

async function getMe(req, res){
    const user  = await userModel.findById(req.user.id);

    res.status(200).json({
        message: 'User info retrieved successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
    

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}