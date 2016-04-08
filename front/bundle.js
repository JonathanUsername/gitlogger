'use strict';

var socket = io();

socket.on('connection', function (socket) {
  console.log('connected', socket);
});

socket.on('event', function (event) {
  appendEvent(event.new_val, true);
});

socket.on('events', function (events) {
  events.forEach(function (event) {
    appendEvent(event, false);
  });
});

function appendEvent(event, fresh) {
  var container = fresh ? $('.new-events') : $('.old-events');
  container.append('<div class="' + event.type + '">\n      <span class="repo">' + event.repo + '</span>\n      <span class="user">' + event.user + '</span>\n      <span class="branch">' + event.branch + '</span>\n      ' + (event.msg ? event.msg : event.type) + '\n    </div>');
}

//# sourceMappingURL=bundle.js.map