import r from 'rethinkdb';

const createTables = () => {
  r.tableCreate('events').run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
  })
};

const newEvent = (event) => {
  r.table('events').insert([event]).run(connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
  })
};

const getEvents = (cb) => {
  r.table('events').run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
      if (err) throw err;
      cb(result);
    });
  });
};

const subscribeToEvents = (cb) => {
  r.table('events').changes().run(connection, function(err, cursor) {
    if (err) throw err;
    console.log('subbing')
    cursor.each(function(err, row) {
      if (err) throw err;
      cb(row);
    });
  });
};

let connection = null;

r.connect({ 
  host: 'localhost', port: 28015 
}, function(err, conn) {
  if (err) throw err;
  connection = conn;
  console.log('connected to rethinkdb.')
  // createTables();
});

export { createTables, newEvent, getEvents, subscribeToEvents };