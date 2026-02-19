const authService = require('../services/auth.service');

exports.signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error){
        console.error('Login error:', error);
        res.status(400).json({ message: error.message });
    }
}