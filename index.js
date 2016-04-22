'use strict';

import Hapi from 'hapi';
import { createTables, newEvent, getEvents } from './db';
import inert from 'inert';
import Bell from 'bell';
import Cookie from 'hapi-auth-cookie';
import { registerSocket } from './socket.js';
// import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './github.secret';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: 8000,
  routes: {
    cors: true
  }
});
registerSocket(server.listener);

server.register([Bell, Cookie, inert], err => {
  // server.auth.strategy('oauth', 'bell', {
  //   provider: 'github',
  //   password: 'Somethingblahblahblahidontknowwhyineedtoaddthisbecauseimanidiot',
  //   // clientId: GITHUB_CLIENT_ID,
  //   // clientSecret: GITHUB_CLIENT_SECRET,
  //   isSecure: false  // CHANGEME
  // })

  // server.auth.strategy('session', 'cookie', {
  //     password: 'yaddayaddayaddakdmgkmdglmgmdkmdsklgmkldmgdklsmlkgmkdlsmgldnjn',
  //     cookie: 'sid',
  //     redirectTo: '/',
  //     redirectOnTry: false,
  //     isSecure: false // CHANGEME
  // })

  // server.route({
  //   method: ['GET', 'POST'], // Must handle both GET and POST
  //   path: '/login',          // The callback endpoint registered with the provider
  //   config: {
  //     auth: 'oauth',
  //     handler: function (request, reply) {

  //       if (!request.auth.isAuthenticated) {
  //         return reply('Authentication failed due to: ' + request.auth.error.message);
  //       }

  //       console.log(request.auth.session)

  //       const c = request.auth.credentials
  //       const profile = c.profile;
  //       profile.token = c.token;
  //       profile.secret = c.secret;
  //       console.log('profile', profile);
  //       // request.auth.session.clear();
  //       request.auth.session.set(profile);

  //       return reply.redirect('/');
  //     }
  //   }
  // });

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

  server.route({
    method: 'GET',
    path:'/createTable', 
    handler: function (request, reply) {
      createTables();
      reply('done!');
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config : {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: function (request, reply) {
        console.log(request.auth.session)
        // if (request.auth.isAuthenticated) {
          reply.file('front/index.html');
        // } else {
          // reply(`<a href="/login">Log the eff in or eff the eff off</a>`)
        // }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{file}',
    handler: {
      file: request => `front/${request.params.file}`
    }
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });
})


