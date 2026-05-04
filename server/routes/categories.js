const express = require('express');
const router = express.Router();

const categories = [
    'Notes',
    'Question Paper',
    'Assignment',
    'Lab Report',
    'Textbook',
    'Presentation',
    'Lecture Slides',
    'Video',
    'Project Work',
    'Other'
];

router.get('/', (req, res) => {
    res.json(categories);
});

module.exports = router;
