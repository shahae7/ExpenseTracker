require('dotenv').config();
const fs = require('fs');
const AuthService = require('./src/services/auth.service');

async function testRegistration() {
    try {
        console.log("Attempting to register test user...");
        const email = `test_${Date.now()}@example.com`;

        await AuthService.register("testuser_" + Date.now(), email, "password123");
        fs.writeFileSync('debug_result.txt', 'SUCCESS');
        console.log("SUCCESS");
    } catch (error) {
        const msg = `FAILED\n${error.message}\n${error.stack}`;
        fs.writeFileSync('debug_result.txt', msg);
        console.log(msg);
    }
}

testRegistration();
