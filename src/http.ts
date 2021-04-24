import express from 'express';

import { router } from './routes';


const app = express();

app.use(express.static('public'));
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/pages/client', (_req, res) => {
  res.render('html/client.html');
});
app.get('/pages/admin', (_req, res) => {
  res.render('html/admin.html');
});

app.use(express.json());

app.use(router);


export { app };
