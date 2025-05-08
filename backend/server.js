const express = require('express');
const mongoose = require('mongoose'); 
const app = express(); 
const PORT = process.env.PORT || 3000;

// Definition of the GET route for the root URL
app.get('/', (req, res) => {
	res.send('PharmaNex Server is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

//Starting the Web Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PharmaNex Server started on port ${PORT}`);
});
