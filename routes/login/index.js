const express = require('express');

const loginCtrl = require('./loginController');

const router = express.Router();

/**
 * Add routes
 */
router.post('/', loginCtrl.login);

module.exports = router;
