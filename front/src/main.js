const socket = io();


socket.on('connection', function(socket){
  console.log('connected', socket)
});

socket.on('event', event => {
  appendEvent(event, true)
});

socket.on('events', events => {
  events.forEach(event => {
    appendEvent(event, false);
  })
});

function appendEvent (event, fresh) {
  const container = fresh ? $('.new-events') : $('.old-events');
  container.append( 
    `<div class="${event.type}">
      <span class="repo">${event.repo}</span>
      <span class="user">${event.user}</span>
      <span class="branch">${event.branch}</span>
      ${event.msg ? event.msg : event.type}
    </div>`
  );
}