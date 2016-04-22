const socket = io();

let shownEvents = [];

socket.on('connection', function(socket){
  console.log('connected', socket)
});

socket.on('event', event => {
  shownEvents.pop();
  shownEvents.unshift(event.new_val);
  drawEvents();
});

socket.on('events', events => {
  shownEvents = shownEvents.concat(events);
  events.forEach(event => {
    drawEvents();
  })
});

function drawEvents (event) {
  const container = $('.latest-events');
  shownEvents.forEach(appendLine);
  
  function appendLine (event) {
    container.append( 
      `<div class="line ${event.type}">
        <span class="repo line-element"><span class="icon mega-octicon octicon-repo"></span>${event.repo}</span>
        <span class="user line-element"><span class="icon mega-octicon octicon-person"></span>${event.user}</span>
        <span class="branch line-element"><span class="icon mega-octicon octicon-git-branch"></span>${event.branch}</span>
        ${event.msg ? event.msg : event.type}
      </div>`
    );
  }
}
