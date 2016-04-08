import { subscribeToEvents, getEvents } from './db';

let io;

export const registerSocket = (listener) => {

  io = require('socket.io')(listener);

  io.on('connection', function(socket) {
    console.log('user connected', socket.id);
    getEvents(sendAllEvents);
    subscribeToEvents(sendEvent);
  });
};

export const sendEvent = (event) => {
  console.log('sending', event)
  io.emit('event', event);
};

export const sendAllEvents = (events) => {
  io.emit('events', events);
};