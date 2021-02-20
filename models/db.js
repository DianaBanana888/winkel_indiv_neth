const {
  connect, connection, disconnect, createConnection,
} = require('mongoose');
const connectMongo = require('connect-mongo');
const session = require('express-session');
require('dotenv').config();

const MongoStore = connectMongo(session);

const connectDb = () => {
  connect(process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  return connection;
};
const sessionStore = new MongoStore({
  mongooseConnection: createConnection(process.env.SESSION_DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }),
});

module.exports = { connectDb, sessionStore, disconnect };
