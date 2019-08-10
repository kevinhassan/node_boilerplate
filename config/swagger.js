const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: 'Node-Boilerplate Swagger API',
        version: '1.0.0'
    },
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
        Bearer:
        {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    schemes: ['http', 'https'],
    security: [
        { Bearer: [] }
    ],
    basePath: '/'
};

const options = {
    swaggerDefinition,
    apis: ['./routes/**/*.js']
};

module.exports = swaggerJSDoc(options);
