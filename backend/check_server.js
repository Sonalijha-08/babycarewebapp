const axios = require('axios');

(async () => {
  try {
    const res = await axios.get('http://localhost:5000/test-email', { timeout: 5000 });
    console.log('Server is running!', res.status);
  } catch (err) {
    console.log('Server not responding:', err.message);
    process.exit(1);
  }
  const cors = require("cors");

  app.use(cors({
    origin: "https://babycarewebapp-97z9.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
})();
