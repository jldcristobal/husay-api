const express = require('express');

const errorHandler = require('../middlewares/error-handler');
const authHandler = require('../middlewares/authentication-handler');

const app = express();

const health = require('./health');
const userEnrollment = require('./user-enrollment');
const login = require('./login');
const download = require('./fileDownload');

const router = express.Router();

/**
 * Error handler
 */
app.use(errorHandler.catchNotFound);
app.use(errorHandler.handleError);


/**
 * Add routes
 */
router.use('/health', health);
router.use('/user',userEnrollment);
router.use('/login',login);
router.use(authHandler.authenticateUser);
router.use('/download',download);

module.exports = router;
