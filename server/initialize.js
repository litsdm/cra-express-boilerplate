import mongoose from 'mongoose';

require('dotenv').config();

const { APP_ENV, DB_USER, DB_PWD, CLUSTER_ADDRESS } = process.env;

const getDBName = () => {
  switch (APP_ENV) {
    case 'development':
      return 'dev';
    default:
      return 'prod';
  }
};

const DB_NAME = getDBName();
const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PWD}@${CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`;

export default cb => {
  const db = mongoose.connection;

  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  db.once('open', () => cb({ db }));
};
