// controllers/aiController.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
// const { Configuration, OpenAIApi } = require('openai');
const { GoogleGenAI } = require("@google/genai")
// import OpenAI from "openai";

require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Database setup
const databasePath = path.join(__dirname, '../database');
if (!fs.existsSync(databasePath)) {
    fs.mkdirSync(databasePath);
}

const dbFilePath = path.join(databasePath, 'responses.db');
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '', { flag: 'w' });
}

const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY, content TEXT)`);
    }
});

// OpenAI Configuration
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);



exports.submitQuestion = async (req, res) => {
    const content = req.query.content;
    const question = req.query.question;
    if (content) {
        db.run(
            'INSERT INTO responses (content) VALUES (?)',
            [`Q: ${question}\nA: ${content}`],
            (err) => {
                if (err) {
                    console.error('❌ Error saving response:', err.message);
                    return res.status(500).send('❌ Error saving response');
                }
                res.send('✅ Response saved successfully');
            }
        );
    } else {
        res.status(400).send('❌ No content received');
    }
};

// Handle webhook requests (GET)
exports.webhook = (req, res) => {
    const content = req.query.content;

    if (content) {
        db.run('INSERT INTO responses (content) VALUES (?)', [content], (err) => {
            if (err) {
                console.error('Error saving response:', err.message);
                return res.status(500).send('Error saving response');
            }
            res.send('Response saved successfully');
        });
    } else {
        res.status(400).send('No content received');
    }
};
