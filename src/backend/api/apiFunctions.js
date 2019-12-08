import { commanderSocket } from './webSocketConnection';

export const API_SendMessage = (macAddress, msgContent) => {
  const data = {
    event: 'cmsg',
    mac: macAddress,
    msg: msgContent
  };

  commanderSocket.send(JSON.stringify(data));
};

export const API_SendFile = (macAddress, fileDir) => {
  const data = {
    event: 'creq',
    mac: macAddress,
    dir: fileDir
  };
  commanderSocket.send(JSON.stringify(data));
};

export const API_refreshOnlineUserList = () => {
  const data = { event: 'rshs' };
  commanderSocket.send(JSON.stringify(data));
};

export const API_killTransaction = port => {
  const data = { event: 'kprg', port: port };
  commanderSocket.send(JSON.stringify(data));
  console.log(port, 'worked');
};
