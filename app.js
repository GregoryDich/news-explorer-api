const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
const authRouter = require('./routes/auth');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const centralErrorHandler = require('./middlewares/centralErrorHandler');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;
const { NODE_ENV, DB_ADDRESS } = process.env;

const app = express();
app.set('trust proxy', 1);
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/newsexplorer');
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(errors());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);
app.post('/signin', authRouter);
app.post('/signup', authRouter);
app.use(auth);
app.use(router);
app.get('*', () => {
  throw new NotFoundError('Requested resource not found');
});
app.use(errorLogger);
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
