'use strict';

var socket = io();

var shownEvents = [];

socket.on('connection', function (socket) {
  console.log('connected', socket);
});

socket.on('event', function (event) {
  shownEvents.pop();
  shownEvents.unshift(event.new_val);
  drawEvents();
});

socket.on('events', function (events) {
  shownEvents = shownEvents.concat(events);
  events.forEach(function (event) {
    drawEvents();
  });
});

function drawEvents(event) {
  var container = $('.latest-events');
  shownEvents.forEach(appendLine);

  function appendLine(event) {
    container.append('<div class="line ' + event.type + '">\n        <span class="repo line-element"><span class="icon mega-octicon octicon-repo"></span>' + event.repo + '</span>\n        <span class="user line-element"><span class="icon mega-octicon octicon-person"></span>' + event.user + '</span>\n        <span class="branch line-element"><span class="icon mega-octicon octicon-git-branch"></span>' + event.branch + '</span>\n        ' + (event.msg ? event.msg : event.type) + '\n      </div>');
  }
}

//# sourceMappingURL=bundle.js.map