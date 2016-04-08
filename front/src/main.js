const socket = io();


socket.on('connection', function(socket){
  console.log('connected', socket)
});

socket.on('event', event => {
  $('.new-events').append(JSON.stringify(event, null, 2));
});

socket.on('events', event => {
  $('.old-events').append(JSON.stringify(event, null, 2));
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