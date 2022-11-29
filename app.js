require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const limiter = require('./middlewares/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./utils/configUrl');

const centralizedErr = require('./middlewares/centralizedErr');

const { PORT = 3002 } = process.env;

mongoose.connect(MONGO_URL);

const app = express();
app.use(helmet());
app.use(cookieParser());

app.use(cors({
  exposedHeaders: '*',
}));

app.use(express.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(centralizedErr);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
