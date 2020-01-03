import React, { createContext, useState, useContext, useEffect } from 'react';
import { MessageContext } from '../MessageContext/MessageContext';
import { hsSocket } from '../../backend/api/webSocketConnection';
import { USER_CREATED } from '../types';

export const OnlineUserContext = createContext();

const OnlineUserContextProvider = props => {
  const [onlineUserList, setOnlineUserList] = useState(() => {
    const tempObject = {
      'virtualmint:08:00:27:fc:3d:f2': {
        event: 'offline',
        mac: '08:00:27:fc:3d:f2',
        userIdentity: 'virtualmint:08:00:27:fc:3d:f2',
        username: 'virtualmint'
      },
      'virtualtwo:08:00:27:13:98:2e': {
        event: 'offline',
        mac: '08:00:27:fc:3d:f2',
        userIdentity: 'virtualtwo:08:00:27:13:98:2e',
        username: 'virtualtwo'
      }
    };
    return tempObject;
  });
  const { messageHistory, dispatch } = useContext(MessageContext);

  hsSocket.onmessage = msg => {
    const toJson = JSON.parse(msg.data);
    const macAddress = toJson.mac;
    const username = toJson.username;
    const userIdentity = username + ':' + macAddress;
    toJson.userIdentity = userIdentity;

    if (messageHistory.hasOwnProperty(userIdentity) === false && toJson.event === 'online') {
      dispatch({ type: USER_CREATED, macAddress: macAddress, username: username, userIdentity: userIdentity });
    }

    setOnlineUserList(onlineUserList => ({ ...onlineUserList, [toJson.userIdentity]: toJson }));
  };

  return <OnlineUserContext.Provider value={{ onlineUserList }}>{props.children}</OnlineUserContext.Provider>;
};

export default OnlineUserContextProvider;

// virtualtwo:08:00:27:13:98:2e:
// event: "online"
// ip: "192.168.1.37"
// mac: "08:00:27:13:98:2e"
// userIdentity: "virtualtwo:08:00:27:13:98:2e"
// username: "virtualtwo"
