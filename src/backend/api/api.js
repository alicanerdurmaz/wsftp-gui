const cmdSocketURI = 'ws://192.168.1.26:9997/cmd';
const srSocketURI = 'ws://192.168.1.26:10003/sr';
const msgSocketURI = 'ws://192.168.1.26:10004/msg';
const hsSocketURI = 'ws://192.168.1.26:10000/hs';

export const commanderSocket = new WebSocket(cmdSocketURI);
export const msgSocket = new WebSocket(msgSocketURI);
export const srScoket = new WebSocket(srSocketURI);
export const hsSocket = new WebSocket(hsSocketURI);

srScoket.onopen = function() {
  console.log('connected to sr ' + srScoket);
};
srScoket.onclose = function(e) {
  console.log('connection closed sr ' + e);
};

commanderSocket.onopen = function() {
  console.log('connected to hs ' + commanderSocket);
};
commanderSocket.onclose = function(e) {
  console.log('connection closed hs ' + e);
};
commanderSocket.onmessage = function(e) {
  console.log('CMD : ' + e);
};
