import { subscribeToEvents, getEvents, dbConnect, dbDisconnect } from './db';

let io;

export const registerSocket = (listener) => {

  io = require('socket.io')(listener);

  io.on('connection', function(socket) {
    console.log('user connected', socket.id);

    dbConnect(conn => {

      getEvents(conn, sendAllEvents);
      subscribeToEvents(conn, (event, cursor) => {

        sendEvent(event);
        socket.on('disconnect', function() {
          console.log('user disconnected');
          cursor.close();
        });

      });

    });
  });
};

export const sendEvent = (event) => {
  console.log('sending', event)
  io.emit('action', {
    type: 'NEW_EVENT',
    payload: event
  });
};

export const sendAllEvents = (events) => {
  io.emit('action', {
    type: 'NEW_EVENT',
    payload: events
  });
};