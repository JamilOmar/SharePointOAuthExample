import { Application } from 'express';
import * as fs from 'fs';
import https = require('https');
import {Helpers} from './server/helpers';
import Server from './server/server';

const app: Application = Server.bootstrap().app;
const port = Helpers.normalizePort(process.env.PORT || '44355');
app.set('port', port);

const creds = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
  };
const server = https.createServer(creds, app);
server.listen(port);
server.on('error', Helpers.onError(port));
server.on('listening', Helpers.onListening(server.address()));
