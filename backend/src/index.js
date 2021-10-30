const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

const dbConnection = require('./database/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/ws/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['authorization']
  }
});

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(require('./routes'));

io.use(function(socket, next){
  if (socket.handshake.headers){
    const authorization = socket.handshake.headers.authorization;
    if(!authorization) {
      return next(new Error('Missing header Authorization'));
    }
    try {
      const token = authorization.split('Bearer ')[1];
      if (!token) {
        return next(new Error('Authentication error'));
      }
      jwt.verify(token, 'secret', function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.userId = decoded.id;
        next();
      });
    }
    catch(error) {
      return next(new Error('Authentication error'));
    }
  }
  else {
    next(new Error('Missing Headers'));
  }    
})
.on('connection', async function(socket) {
  const user = await dbConnection.models.User.findByPk(socket.userId);
  io.emit('message', JSON.stringify({from: 'SYSTEM', date: Date.now(), message: `${user.name} has connected to the chat.`}));
  socket.on('disconnect', () => {
    io.emit('message', JSON.stringify({from: 'SYSTEM', date: Date.now(), message: `${user.name} has disconnected.`}));
  });
  socket.on('message', function(message) {
    io.emit('message', message);
  });
});

const port = 3000;

(async () => {
  try{
    await dbConnection.authenticate();
    console.log('Connected to the database successfully');
  } catch(e) {
    console.log('Error connecting to the database:', e);
  }

  server.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
  });
})();