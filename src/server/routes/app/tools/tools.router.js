const express = require('express');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

router.get('/tools', (req,res) => {
    res.render('tools/index', {})
});

module.exports = router;
