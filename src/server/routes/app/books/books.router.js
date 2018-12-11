const express = require('express');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

router.get('/books', (req,res) => {
    res.render('books/index', {})
});

module.exports = router;
