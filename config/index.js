const dotenv = require('dotenv');
const logger = require('../util/logger');

const ENVIRONMENT = (process.env.NODE_ENV_DOCKER || process.env.NODE_ENV || 'development');

let databaseEnv = '_dev';
if (ENVIRONMENT === 'test') {
    databaseEnv = '_test';
} else if (ENVIRONMENT === 'production') {
    databaseEnv = '';
}

if (ENVIRONMENT !== 'production') {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    dotenv.config();
}

if (!(process.env.MONGODB_URI_DOCKER || process.env.MONGODB_URI)) {
    console.log('No mongo connection string. Set MONGODB_URI environment variable.');
    process.exit(1);
}
const DATABASE_URI = (process.env.MONGODB_URI_DOCKER || process.env.MONGODB_URI) + databaseEnv;

module.exports = { DATABASE_URI, ENVIRONMENT };
