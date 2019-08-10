const winston = require('winston');

let logger = {};
if (process.env.NODE_ENV !== 'production') {
    logger = winston.createLogger({
        transports: [
            new (winston.transports.Console)({ level: 'debug' })
        ]
    });
} else {
    logger = winston.createLogger({
        transports: [
            new (winston.transports.Console)({
                level: 0,
                silent: true
            })
        ]
    });
}

module.exports = logger;
