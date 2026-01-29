const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

class AuthService {
    static async register(username, email, password) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await UserModel.create(username, email, passwordHash);
        return { user, token: this.generateToken(user.id) };
    }

    static async login(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return { user: { id: user.id, username: user.username, email: user.email }, token: this.generateToken(user.id) };
    }

    static generateToken(userId) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}

module.exports = AuthService;
