import React, { createContext, useState, useContext, useEffect } from 'react';
import { MessageContext } from '../MessageContext/MessageContext';
import { hsSocket } from '../../backend/api/webSocketConnection';
import { USER_CREATED } from '../types';
import allUserList from '../../database/allUserList.json';

export const OnlineUserContext = createContext();

const OnlineUserContextProvider = props => {
  const [onlineUserList, setOnlineUserList] = useState(() => {
    const tempObject = allUserList;
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
    if (onlineUserList.hasOwnProperty(userIdentity)) {
      toJson.muted = onlineUserList[userIdentity].muted;
      toJson.notificationNumber = onlineUserList[userIdentity].notificationNumber;
    } else {
      toJson.muted = false;
      toJson.notificationNumber = 0;
    }
    setOnlineUserList(onlineUserList => ({ ...onlineUserList, [toJson.userIdentity]: toJson }));
  };

  const incrementNotificationNumber = userIdentity => {
    if (!userIdentity) return;

    const tempObject = { ...onlineUserList };
    tempObject[userIdentity].notificationNumber++;
    setOnlineUserList(tempObject);
  };
  const resetNotificationNumber = userIdentity => {
    if (!userIdentity) return;

    const tempObject = { ...onlineUserList };
    tempObject[userIdentity].notificationNumber = 0;
    setOnlineUserList(tempObject);
  };

  return (
    <OnlineUserContext.Provider value={{ onlineUserList, incrementNotificationNumber, resetNotificationNumber }}>
      {props.children}
    </OnlineUserContext.Provider>
  );
};

export default OnlineUserContextProvider;

// virtualtwo:08:00:27:13:98:2e:
// event: "online"
// ip: "192.168.1.37"
// mac: "08:00:27:13:98:2e"
// userIdentity: "virtualtwo:08:00:27:13:98:2e"
// username: "virtualtwo"
