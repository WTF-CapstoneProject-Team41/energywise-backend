const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Profile, sequelize } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/env');

exports.signup = async (data) => {
    const {email, phone, password, first_name, last_name} = data;
    
    if (!password) throw new Error('Password is required');
    if (!email && !phone) throw new Error('Email or phone is required');
    if (!first_name || !last_name) {
    throw new Error('First name and last name are required');
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

  const transaction = await sequelize.transaction();
    try {
        const user = await User.create({
      email,
      phone,
      password_hash: hashedPassword,
      user_type: null
    }, { transaction });

    await Profile.create({
      user_id: user.id,
      first_name,
      last_name,
      phone
    }, { transaction });

    await transaction.commit();

    const token = jwt.sign(
      { id: user.id, role: user.role, user_type: user.user_type },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      message: 'User signed up successfully',
      token
    };
    } catch (error) {
        await transaction.rollback();
        throw error;

    }    
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

    // update last login
    user.last_login = new Date();
    await user.save();

    const token = jwt.sign(
    { id: user.id, role: user.role, user_type: user.user_type },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
   

    return {
        message: 'Login successful',
        token
    };
}