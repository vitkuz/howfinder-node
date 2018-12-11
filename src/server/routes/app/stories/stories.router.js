const express = require('express');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

router.get('/stories', (req,res) => {
    res.render('stories/index', {})
});

module.exports = router;
