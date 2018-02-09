const express = require('express');


const router = express.Router();

router.post('/sendEmail', (req, res) => {
    console.log('here!');
});

module.exports = router;
