const AuthService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const { user, token } = await AuthService.register(username, email, password);
        console.log(`[Register] Success: ${email}`);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error(`[Register] Failed: ${error.message}`, error);
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const { user, token } = await AuthService.login(email, password);
        res.json({ user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
