const os = require('os');
const networkInterfaces = os.networkInterfaces();

const findIpAddress = () => {
  for (let interfaces in networkInterfaces) {
    for (let inter in networkInterfaces[interfaces]) {
      let curr = networkInterfaces[interfaces][inter];
      if (curr['internal'] === false && curr['family'] === 'IPv4') {
        return curr['address'];
      }
    }
  }
};
const ip = findIpAddress();

const cmdSocketURI = `ws://${ip}:9997/cmd`;
const srSocketURI = `ws://${ip}:10003/sr`;
const msgSocketURI = `ws://${ip}:10004/msg`;
const hsSocketURI = `ws://${ip}:10000/hs`;

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
  console.log('connected to commanderSocket ' + commanderSocket);
};
commanderSocket.onclose = function(e) {
  console.log('connection closed commanderSocket ' + e);
};
commanderSocket.onmessage = function(e) {
  console.log('CMD : ' + e);
};
