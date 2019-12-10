
var http = require('http');
var net = require('net');

var port;
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(server) {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// 检测端口是否被占用
function portIsOccupied(port, cb) {
  const server = net.createServer().listen(port)
  server.on('listening', () => {
    console.log(`the server will running on port ${port}`)
    server.close()
    cb(null, port)
    console.log('port', port)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      portIsOccupied(port + 10, cb)
      console.log(`this port ${port} is occupied.try another.`)
    } else {
      cb(err)
    }
  })
}

/**
 *
 * @param app app实例
 * @param options 可选参数
 * @returns {Promise}
 */
module.exports = async function (app, options) {
  /**
   * Get port from environment and store in Express.
   */

  port = normalizePort(process.env.PORT || options.port || '3000');

  /**
   * Listen on provided port, on all network interfaces.
   */
  return new Promise((resolve, reject) => {
    'use strict';

    portIsOccupied(port, function (err, nport) {
      if (err) {
        return console.log(err);
      }
      port = nport;
      app.set('port', port);

      var server = http.createServer(app);

      server.listen(port);
      server.on('error', e => {
        onError(e);
        reject(e);
      });
      server.on('listening', x => {
        onListening(server);
        resolve({
          port: port
        });
      });
    })
  });
};
