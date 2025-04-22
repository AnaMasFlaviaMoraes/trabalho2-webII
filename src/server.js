const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});