const express = require('express');
const path = require('path');
const userRouter = require('./routes/user-routes.js');
const session = require('express-session');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});