const express = require('express');
const app = express(); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const patientRoutes = require('./routes/patients');


app.use(express.json());

//Updating this file with routes from patients.js
app.use('/api/patients', patientRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;