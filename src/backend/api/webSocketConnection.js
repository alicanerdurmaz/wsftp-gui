import { sleep } from '../../Helpers/sleep';
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

hsSocket.onopen = function() {
	console.log('Connected to hs', srScoket);
};

srScoket.onopen = function() {
	console.log('connected to sr ', srScoket);
};
srScoket.onclose = function(e) {
	console.log('connection closed sr ', e);
};

commanderSocket.onopen = function() {
	console.log('connected to commanderSocket ', commanderSocket);
	API_getMyInfo();
};

commanderSocket.onclose = function(e) {
	console.log('connection closed commanderSocket ', e);
};
commanderSocket.onmessage = function(e) {
	console.log('CMD : ', e);
};
export const API_SendMessage = (macAddress, msgContent) => {
	const data = {
		event: 'cmsg',
		mac: macAddress,
		msg: msgContent
	};
	commanderSocket.send(JSON.stringify(data));
};

export const API_SendFile = async (macAddress, fileDirArray, idArray) => {
	for (let i = 0; i < fileDirArray.length; i++) {
		const data = {
			event: 'creq',
			mac: macAddress,
			dir: fileDirArray[i],
			uuid: idArray[i]
		};
		commanderSocket.send(JSON.stringify(data));
		await sleep(100);
	}
	return false;
};

export const API_refreshOnlineUserList = () => {
	const data = { event: 'rshs' };
	commanderSocket.send(JSON.stringify(data));
};

export const API_killTransaction = port => {
	const data = { event: 'kprg', port: port };
	commanderSocket.send(JSON.stringify(data));
};

export const API_saveJson = (mac, input) => {
	const data = { event: 'save', mac: mac, input: input };
	commanderSocket.send(JSON.stringify(data));
};

export const API_getJson = mac => {
	const data = { event: 'get', mac: mac };
	commanderSocket.send(JSON.stringify(data));
};

export const API_getMyInfo = () => {
	const data = { event: 'my' };
	commanderSocket.send(JSON.stringify(data));
};
