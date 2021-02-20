const createError = require('http-errors');
const express = require('express');

const path = require('path');
const logger = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const { connectDb, sessionStore } = require('./models/db.js');

const app = express();
const port = process.env.PORT || 3000;
const startServer = () => {
  app.listen(port, () => {
    console.log('Server started at http://localhost:%s/', port);
  });
};
connectDb()
  .on('error', (err) => console.log(err.message))
  .on('disconnected', connectDb)
  .once('open', startServer)
  .on('close', () => console.log('Mongo close'));

const indexRoute = require('./src/routes/index');
const myAccountRoute = require('./src/routes/myAccount');
const shoppingCard = require('./src/routes/shoppingCard');
const createItem = require('./src/routes/createItem');
const authRoute = require('./src/routes/auth');
const { isLocalName, isNotFound } = require('./middleware/auth');

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'));

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  }),
);
// app.use(require('express-session')({
//   secret: 'keyboard cat', resave: true, saveUninitialized: true
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));

app.use(isLocalName);
app.use('/', indexRoute);
app.use('/myAccount', myAccountRoute);
app.use('/createItem', createItem);
app.use('/auth', authRoute);
app.use('/shoppingCard', shoppingCard);
app.use(isNotFound);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
