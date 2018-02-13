const express = require('express');

const router = express.Router();

const { sendEmail } = require('../controllers/sendController');

router.get('', (req, res) => {
    res.send('lol');
});

router.post('/sendEmail', (req, res) => {
    res.send('Request recieved.');
    console.log(req.body);
    //sendEmail(req);
});


module.exports = router;
