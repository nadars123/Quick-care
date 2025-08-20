const swaggerJSDoc = require('swagger-jsdoc')

// Swagger JSDoc configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctorino',
      version: '1.0.0',
      description: 'API Documentation for Doctorino Application', 
    },
  },
  apis: ['./routes/*.js'], 
}

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports =  swaggerSpec;
