var zmq = require('zmq');
socket = zmq.socket('sub');


const topics = [
  'alias',
  'aliashistory',
  'aliastxhistory',
  'asset',
  'assetallocation',
  'assethistory',
  'cert',
  'certhistory',
  'escrow',
  'escrowbid',
  'feedback',
  'offer',
  'offerhistory'
];

const received = {};
topics.forEach(t => received[t] = 0);


// Register to monitoring events
socket.on('connect', function (fd, ep) { console.log('connect, endpoint:', ep); });
socket.on('connect_delay', function (fd, ep) { console.log('connect_delay, endpoint:', ep); });
socket.on('connect_retry', function (fd, ep) { console.log('connect_retry, endpoint:', ep); });
socket.on('listen', function (fd, ep) { console.log('listen, endpoint:', ep); });
socket.on('bind_error', function (fd, ep) { console.log('bind_error, endpoint:', ep); });
socket.on('accept', function (fd, ep) { console.log('accept, endpoint:', ep); });
socket.on('accept_error', function (fd, ep) { console.log('accept_error, endpoint:', ep); });
socket.on('close', function (fd, ep) { 
  console.log('close, endpoint:', ep); 
  logReceived(); 
});
socket.on('close_error', function (fd, ep) { 
  console.log('close, endpoint:', ep); 
  logReceived(); 
});
socket.on('disconnect', function (fd, ep) { 
  console.log('close, endpoint:', ep); 
  logReceived(); 
});

// Handle monitor error
socket.on('monitor_error', function (err) {
  console.log('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
  setTimeout(function () { socket.monitor(500, 0); }, 5000);
});

topics.forEach(t => socket.subscribe(t));

socket.on('message', function (topic, message) {
  const topicName = topic.toString('utf-8');
  const messageString = message.toString('utf-8');
  received[topicName] += 1;
  console.log(topicName, received[topicName]);
});

// Call monitor, check for events every 500ms and get all available events.
console.log('Start monitoring...');
socket.monitor(500, 0);
socket.connect('tcp://127.0.0.1:3030');


function logReceived() {
  Object.keys(received).forEach(k => console.log(k, received[k]));
}