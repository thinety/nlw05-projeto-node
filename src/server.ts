import { createServer } from 'http';

import { app } from './http';
import { io } from './ws';

import './database';


const server = createServer(app);
io.attach(server);

server.listen(3333, () => {
  console.log('Server is running on port 3333');
});
