const express = require('express'); 
const app = express(); 

// Definition of the GET route for the URL
app.get('/', (req, res) => {
	res.send('PharmaNex Server is running');
});

app.listen(3000, '0.0.0.0', () => {
  console.log('PharmaNex Server started on port 3000');
});
