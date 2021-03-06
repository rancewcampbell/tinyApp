const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override')
const { urlDatabase, userDatabase } = require('./database');
const { PORT, KEY } = require('./constants');

// middleware & rendering engine
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: [KEY],
}));

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');

// middleware to fetch logged in user's data:
app.use((req, res, next) => {
  const loggedIn = userDatabase[req.session.user_id];
  req.templateVars = {
    urls: urlDatabase,
    user: loggedIn,
    message: null
  };
  next();
});

// Declare routers
const urlRouter = require('./routes/urls');
const uRouter = require('./routes/u');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');


// Routes
app.get('/', (req, res) => {
  req.templateVars.user ? res.redirect('/urls') : res.render('home', req.templateVars);
});

app.use('/urls', urlRouter);

app.use('/u', uRouter);

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.use('/logout', logoutRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
