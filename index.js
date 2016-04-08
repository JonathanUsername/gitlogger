'use strict';

import Hapi from 'hapi';
import { createTables, newEvent, getEvents } from './db';
import inert from 'inert';
import { registerSocket } from './socket.js';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: 8000 
});
registerSocket(server.listener);

server.route({
  method: 'POST',
  path:'/checkout', 
  handler: function (request, reply) {
    const { repo, branch, user } = request.payload;
    newEvent({ 
      repo, branch, user,
      type: 'checkout'
    });
    return reply();
  }
});

server.route({
  method: 'POST',
  path:'/commit', 
  handler: function (request, reply) {
    const { repo, branch, user, msg } = request.payload;
    newEvent({ 
      repo, branch, user, msg,
      type: 'commit'
    });
    return reply();
  }
});

server.route({
  method: 'GET',
  path:'/events', 
  handler: function (request, reply) {
    const events = getEvents(reply);
  }
});

server.register(inert, (err) => {
  if (err) throw err;
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('front/index.html');
    }
  });
  server.route({
    method: 'GET',
    path: '/bundle.js',
    handler: function (request, reply) {
      reply.file('front/bundle.js');
    }
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });

});
