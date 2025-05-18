// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const aiRoutes = require('./routes/aiRoutes');
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Ensure database folder exists
const databasePath = path.join(__dirname, 'database');
if (!fs.existsSync(databasePath)){
    fs.mkdirSync(databasePath);
}

// Use the AI routes (this is critical)
app.use('/', aiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
