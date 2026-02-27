const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User, Profile, sequelize } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/env');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

exports.googleAuth = async (data) => {
  const { idToken } = data;

  if (!idToken) {
    throw new Error("Google token is required");
  }

  //  Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload.email) {
    throw new Error("Invalid Google account");
  }

  //  Check if user exists
  let user = await User.findOne({
    where: { email: payload.email }
  });

  const transaction = await sequelize.transaction();

  try {

    //  If user does NOT exist → create user + profile
    if (!user) {

      user = await User.create({
        email: payload.email,
        password_hash: null, // IMPORTANT
        user_type: null,
        account_status: "ACTIVE"
      }, { transaction });

      await Profile.create({
        user_id: user.id,
        first_name: payload.given_name || "",
        last_name: payload.family_name || "",
        phone: null
      }, { transaction });

    }

    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  //  Update last login
  user.last_login = new Date();
  await user.save();

  //  Generate JWT (same structure as signup/login)
  const token = jwt.sign(
    { id: user.id, role: user.role, user_type: user.user_type },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return {
    message: "Google login successful",
    token
  };
};