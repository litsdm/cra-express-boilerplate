import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Server } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config/serverConfig.json';
import initialize from './initialize';

import apiV1 from './api/v1';

const app = express();
const httpServer = Server(app);

app.use(cookieParser());
app.use(cors({ exposedHeaders: config.corsHeaders }));
app.use(bodyParser.json({ limit: config.bodyLimit, extended: true }));
app.use(bodyParser.text());
app.use(helmet());
app.use(morgan('dev'));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      childSrc: ["'self'"],
      scriptSrc: ["'self'", "'*'"],
      scriptSrcElem: ["'self'", "'*'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      baseUri: ["'self'"]
    }
  })
);

initialize(() => {
  app.use('/api', apiV1({ config }));

  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line global-require
    const root = require('path').join(__dirname, 'build');
    app.use(express.static(root));
    app.get('*', (req, res) => {
      res.sendFile('build/index.html', { root: __dirname });
    });
  }

  httpServer.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${httpServer.address().port}`);
  });
});
