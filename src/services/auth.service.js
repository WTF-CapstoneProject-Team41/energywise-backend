const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/env');

exports.signup = async (data) => {
    const {email, phone, password} = data;
    if (!password){
        throw new Error('Password is required');
    }

    if(!email && !phone){
        throw new Error('Email or phone are required');
    }
    const existingUser = await User.findOne({ 
        where: { 
            [Op.or]: [
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean)
        }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        phone,
        password_hash: hashedPassword
    });

    const token = jwt.sign(
        {id: user.id, role: user.role},
        config.jwt.secret,
        {expiresIn: config.jwt.expiresIn}
    );

    return {
        message: 'User signed up successfully',
        token
    };
};

exports.login = async (data) => {
   const {identifier, password} = data;
    if (!identifier || !password) {
        throw new Error('Email/phone and password are required');
    }

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: identifier },
                { phone: identifier }
            ]
        }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!user.password_hash) {
        throw new Error('Use Google login');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {id: user.id, role: user.role},
        config.jwt.secret,
        {expiresIn: config.jwt.expiresIn},
    );
   

    return {
        message: 'Login successful',
        token
    };
}