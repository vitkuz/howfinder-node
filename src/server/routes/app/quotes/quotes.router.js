const express = require('express');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

router.get('/quotes', (req,res) => {
    res.render('quotes/index', {})
});

module.exports = router;
