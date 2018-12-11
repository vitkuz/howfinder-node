const express = require('express');
const router = express.Router();

const ifUserExist = require('../../../utils/ifUserExist');
const ifUserNotExist = require('../../../utils/ifUserNotExist');

router.get('/dev/session', (req,res) => {
    res.json(req.session);
});

module.exports = router;
