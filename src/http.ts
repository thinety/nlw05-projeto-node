import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import './database';

import { router } from './routes';


const app = express();
const http = createServer(app);
const io = new Server(http);

app.use(express.static('public'));
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/pages/client', (_req, res) => {
  res.render('html/client.html');
});

app.use(express.json());

app.use(router);

io.on('connection', socket => {
  // console.log('Se conectou', socket.id);
});


export { http, io };
