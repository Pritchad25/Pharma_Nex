const express = require('express');
const app = express(); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const patientRoutes = require('./routes/patients');
const pharmacyRoutes = require('./routes/pharmacies');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

//Updating this file with routes from patients.js
app.use('/api/patients', patientRoutes);

//Updating this file with routes from pharmacies.js
app.use('/api/pharmacies', pharmacyRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Error handling middleware
app.use(errorHandler);

module.exports = app;