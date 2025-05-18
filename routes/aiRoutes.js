// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController'); // Correct path

// Route to display the form (optional for React)
router.get('/', (req, res) => {
    res.send("This is the API for the AI. Use the React frontend to ask questions.");
    console.log('fss')
});

// Route to handle form submission (with OpenAI)
 router.get('/submit-question', aiController.submitQuestion);

// Webhook route to receive AI response (GET)
 router.get('/webhook', aiController.webhook);

module.exports = router;
