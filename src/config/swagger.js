const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EnergyWise API',
            version: '1.0.0',
            description: 'API documentation for the EnergyWise application'
        },
        servers: [
                {
                    url: 'https://energywise-backend.onrender.com',
                    description: 'Production server'
                },
                {
                    url: 'http://localhost:5000',
                    description: 'Local server'
                }
            ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
        },        
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;