import { subscribeToEvents, getEvents, dbConnect } from './db';

let io;

const sockets = {};

export const registerSocket = (listener) => {

  io = require('socket.io')(listener);

  io.on('connection', function(socket) {
    console.log('user connected', socket.id);
    const dbConn = dbConnect();
    sockets[socket.id] = {
      dbConnection: dbConn
    }
    getEvents(sendAllEvents, dbConn);
    subscribeToEvents(sendEvent, dbConn);
  });
};

export const sendEvent = (event) => {
  console.log('sending', event)
  io.emit('event', event);
};

export const sendAllEvents = (events) => {
  io.emit('events', events);
};