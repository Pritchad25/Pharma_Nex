const express = require('express'); 
const app = express(); 
const PORT = process.env.PORT || 3000;

// Definition of the GET route for the root URL
app.get('/', (req, res) => {
	res.send('PharmaNex Server is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PharmaNex Server started on port ${PORT}`);
});
