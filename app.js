const express = require('express');
const app = express();

app.set('view engine', 'ejs'); // Set EJS as view engine
app.use(express.static('public')); // To serve static files like CSS

app.get('/', (req, res) => {
  const userName = "Hanu";
  res.render('index', { userName });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
