const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'PharmaNex', version: '1.0.0'},
    },
    apis: [path.join(__dirname, '../routes/*.js')],
});