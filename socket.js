import { subscribeToEvents, getEvents, dbConnect, dbDisconnect } from './db';

let io;

const sockets = {};

export const registerSocket = (listener) => {

  io = require('socket.io')(listener);

  let dbConn;

  io.on('connection', function(socket) {
    console.log('user connected', socket.id);
    dbConnect(conn => {
      getEvents(sendAllEvents, conn);
      subscribeToEvents(sendEvent, conn);
    });
    sockets[socket.id] = {
      dbConnection: dbConn
    };
  });
  io.on('disconnect', function(socket) {
    console.log('user disconnected', socket.id);
    dbDisconnect(dbConn);
  });
};

export const sendEvent = (event) => {
  console.log('sending', event)
  io.emit('event', event);
};

export const sendAllEvents = (events) => {
  io.emit('events', events);
};