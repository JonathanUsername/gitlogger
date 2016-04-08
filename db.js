import r from 'rethinkdb';

let genericConnection = null;

// Generic connection for git hooks:
r.connect({ 
  host: 'localhost', port: 28015 
}, function(err, conn) {
  if (err) throw err;
  genericConnection = conn;
  console.log('connected to rethinkdb.')
});

const dbConnect = (cb) => {
  r.connect({ 
    host: 'localhost', port: 28015 
  }, function(err, conn) {
    if (err) throw err;
    cb(conn);
  });
};

const dbDisconnect = (conn) => {
  conn.close();
  console.log('disconnected from db');
};

const createTables = () => {
  r.tableCreate('events').run(genericConnection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
  })
};

const newEvent = (event) => {
  r.table('events').insert([event]).run(genericConnection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
  })
};

const getEvents = (cb, conn) => {
  r.table('events').run(conn, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
      if (err) throw err;
      cb(result);
    });
  });
};

const subscribeToEvents = (cb, conn) => {
  r.table('events').changes().run(conn, function(err, cursor) {
    if (err) throw err;
    console.log('subbing')
    cursor.each(function(err, row) {
      if (err) throw err;
      cb(row);
    });
  });
};



export { createTables, newEvent, getEvents, subscribeToEvents, dbDisconnect };