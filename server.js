const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.post('/submit', upload.single('resume'), (req, res) => {
    const { full_name, email, telegram_username, portfolio_link, job_role, cover_letter } = req.body;
    const resumePath = req.file ? req.file.path : '';

    console.log('New application received:');
    console.log({ full_name, email, telegram_username, portfolio_link, job_role, cover_letter, resumePath });

    res.send('Application submitted successfully!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
