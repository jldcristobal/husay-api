const bodyParser = require('body-parser');
const config = require('config')
const cookieParser = require('cookie-parser');;
const cors = require('cors');
require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload')
const fs = require('fs');
const helmet = require('helmet');
const yaml = require('js-yaml');
const nocache = require('nocache')
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const node_env = process.env.NODE_ENV || 'development';

const errorHandler = require('./middlewares/error-handler')
const routes = require('./routes');
const sequelize = require('./helpers/mysql-db-helper');

const app = express();

app.use(cors());

/**
 * Update Swagger Document
 */
const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, './public', 'open-api.yaml'), 'utf8'));

/**
 * Block unsecure connection
 */
if (node_env === 'production') {

	app.use(function (req, res, next) {
		if (!req.secure) {
			res.status(401).send('Request is unauthorized');
		} else {
			next();
		}
	});
	app.enable('trust proxy');
}

/**
 * Support json parsing
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));

/** 
 * Setup middleware for authentication
 */
app.use(helmet());
app.use(cookieParser());
app.use(nocache());
app.enable('trust proxy');

/**
 * Allow external access to uploads folder
 */
app.use(express.static('uploads'))

/**
 * Allow file upload
 */
app.use(fileUpload());

/**
 * GET home page
 */
app.get('/', (req, res) => {
	res.redirect('/api-docs');
});

var swaggerOptions = {
	defaultModelsExpandDepth: -1,
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, swaggerOptions));

/**
 * Register routes
 */
app.use('/api', routes);

/**
 * Error handler
 */
app.use(errorHandler.catchNotFound);
app.use(errorHandler.handleError);

/**
 * Connect to database using sequelize
 */
sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully')
	}).catch((error) => {
		console.error('Unable to connect to the database:', error)
	})

/**
 * Start server
 */
const host = process.env.HOST;
let port = process.env.PORT;
if (port == null || port == "") {
	port = 8000;
}

app.listen(port, () => {
	console.log(`App listening on http://${host}:${port}`);
	console.log(`Swagger UI is available at http://${host}:${port}/api-docs`);
});