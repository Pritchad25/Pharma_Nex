/**
 * @file Application entry point.
 * @description Connects to MongoDB and starts the Express server.
 * Route/middleware config lives in app.js, not here.
 */

 
 const mongoose = require('mongoose');
 const app = require('./app');
 require('dotenv').config(); //Loading the .env file before accessing `process.env`
 const PORT = process.env.PORT || 3000;

/**Definition of the GET route for the root URL
app.get('/', (req, res) => {
	res.send('PharmaNex Server is running');
});
*/

// MongoDB connection
mongoose.connect(process.env.MONGODB_TEST_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

//Starting the Web Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PharmaNex Server started on port ${PORT}`);
});
