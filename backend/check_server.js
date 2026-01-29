const axios = require('axios');

async function checkServer() {
    console.log("Checking Backend Health...");
    try {
        await axios.get('http://localhost:5000/');
        console.log("✅ Backend is UP (http://localhost:5000)");

        console.log("\nAttempting Registration via HTTP...");
        const email = `check_${Date.now()}@test.com`;
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            username: `check_${Date.now()}`,
            email: email,
            password: 'password123'
        });
        console.log("✅ Registration API Works!");
        console.log("User:", res.data.user.email);
    } catch (error) {
        console.log("❌ Test Failed");
        if (error.code === 'ECONNREFUSED') {
            console.log("reason: Server is NOT RUNNING on port 5000.");
        } else if (error.response) {
            console.log("reason: Server responded with error:", error.response.status, error.response.data);
        } else {
            console.log("reason:", error.message);
        }
    }
}

checkServer();
