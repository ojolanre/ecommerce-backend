const { users: User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ 
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'customer'
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser,
            data: { id: newUser.id, email: newUser.email } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
        error: error.message
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};