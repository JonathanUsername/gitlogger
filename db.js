import r from 'rethinkdb';


const dbConnect = (cb) => {
  r.connect({ 
    host: 'localhost', port: 28015
  }, function(err, conn) {
    if (err) throw err;
    console.log('connected to db')
    cb(conn);
  });
};

// dbConnect(conn => {
//   r.tableDrop('events').run(conn, () => {
//     createTables();
//   });
// })


const dbDisconnect = (conn) => {
  conn.close();
  console.log('disconnected from db');
};

const createTables = () => {
  dbConnect(conn => {
    r.tableCreate('events').run(conn, function(err, result) {
      if (err) throw err;
      r.table('events')
        .indexCreate('time')
        .run(conn, () => {
          if (err) throw err;
          dbDisconnect(conn);
        })
    })
  })
};

const newEvent = (event) => {
  event.time = new Date().getTime();
  dbConnect(conn => {
    r.table('events')
      .insert([event])
      .run(conn, function(err, result) {
        if (err) throw err;
        dbDisconnect(conn);
      })
  })
};

const getEvents = (conn, cb) => {
  r.table('events')
    .orderBy({ index: r.desc('time') })
    .limit(5)
    .run(conn, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        cb(result);
      });
    });
};

const subscribeToEvents = (conn, cb) => {
  r.table('events')
    .changes()
    .run(conn, function(err, cursor) {
      if (err) throw err;
      console.log('subbing')
      cursor.each(function(err, row) {
        if (err) throw err;
        cb(row, cursor);
      });
    });
};



export { createTables, newEvent, getEvents, subscribeToEvents, dbDisconnect, dbConnect };