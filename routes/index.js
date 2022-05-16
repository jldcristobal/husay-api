const express = require('express');

const errorHandler = require('../middlewares/error-handler');

const app = express();

const health = require('./health');
const artist = require('./artist')

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
router.use('/artist',artist);

module.exports = router;
