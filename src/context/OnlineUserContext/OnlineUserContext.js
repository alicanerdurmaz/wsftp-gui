import React, { createContext, useState, useContext, useEffect } from 'react';
import { MessageContext } from '../MessageContext/MessageContext';
import { hsSocket } from '../../backend/api/webSocketConnection';
import { USER_CREATED, USER_DELETED, DELETE_DB, MEDIA_USER_CREATED } from '../types';

import { getObject, deleteDataBaseSync } from '../../backend/api/dbFunctions';
import { SelectUserContext } from '../SelectUserContext';
import { DatabaseMessageContext } from '../DatabaseMessageContext/DatabaseMessageContext';
import findDbDirectory from '../../Helpers/findDbDirectory';
import { MediaContext } from '../MediaContext/MediaContext';
const { app } = require('electron').remote;

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

export const OnlineUserContext = createContext();

const OnlineUserContextProvider = props => {
  const [onlineUserList, setOnlineUserList] = useState(() => {
    return allUsersList;
  });
  const { messageHistory, newUser, dispatch } = useContext(MessageContext);
  const { mediaList, dispatchMediaContext } = useContext(MediaContext);
  const { dispatchDbContext } = useContext(DatabaseMessageContext);
  const { setSelectedUser } = useContext(SelectUserContext);

  useEffect(() => {
    addNewUser(newUser);
    // eslint-disable-next-line
  }, [newUser]);

  hsSocket.onmessage = msg => {
    console.log(msg.data);
    const toJson = JSON.parse(msg.data);
    toJson.userIdentity = toJson.username + ':' + toJson.mac;

    if (messageHistory.hasOwnProperty(toJson.userIdentity) === false && toJson.event === 'online') {
      dispatch({
        type: USER_CREATED,
        macAddress: toJson.mac,
        username: toJson.username,
        userIdentity: toJson.userIdentity
      });
    }
    if (mediaList.hasOwnProperty('media:' + toJson.userIdentity) === false && toJson.event === 'online') {
      dispatchMediaContext({
        type: MEDIA_USER_CREATED,
        userIdentity: toJson.userIdentity
      });
    }
    if (onlineUserList.hasOwnProperty(toJson.userIdentity)) {
      const tempObject = { ...onlineUserList };
      tempObject[toJson.userIdentity].event = toJson.event;
      setOnlineUserList(tempObject);
    }
    if (!onlineUserList.hasOwnProperty(toJson.userIdentity)) {
      const tempObject = { ...onlineUserList };
      tempObject[toJson.userIdentity] = toJson;
      tempObject[toJson.userIdentity].notificationNumber = 0;
      tempObject[toJson.userIdentity].muted = false;
      setOnlineUserList(tempObject);
    }
  };

  const incrementNotificationNumber = userIdentity => {
    if (!userIdentity) return;

    if (onlineUserList.hasOwnProperty(userIdentity)) {
      const tempObject = { ...onlineUserList };
      tempObject[userIdentity].notificationNumber++;
      setOnlineUserList(tempObject);
    }
  };

  const resetNotificationNumber = userIdentity => {
    if (!userIdentity) return;

    const tempObject = { ...onlineUserList };
    tempObject[userIdentity].notificationNumber = 0;
    setOnlineUserList(tempObject);
  };

  const muteOrUnmute = (userIdentity, status) => {
    const tempObject = { ...onlineUserList };
    tempObject[userIdentity].isMuted = status;
    setOnlineUserList(tempObject);
  };

  const deleteUser = userIdentity => {
    setSelectedUser(false);

    deleteDataBaseSync(`${userIdentity}.json`, './src/database/');

    resetNotificationNumber(userIdentity);
    const tempObject = { ...onlineUserList };
    delete tempObject[userIdentity];
    setOnlineUserList(tempObject);
    dispatch({ type: USER_DELETED, userIdentity: userIdentity });
    dispatchDbContext({ type: DELETE_DB, userIdentity: userIdentity });
  };

  const addNewUser = userIdentity => {
    if (!userIdentity) return;
    const tempObject = { ...onlineUserList };
    const splitted = userIdentity.split(':');
    let macAdress = '';
    for (let i = 1; i < splitted.length - 1; i++) {
      macAdress += splitted[i];
      macAdress += ':';
    }
    macAdress += splitted[splitted.length - 1];
    tempObject[userIdentity] = {
      event: 'online',
      ip: '192.168.1.23',
      username: splitted[0],
      mac: macAdress,
      userIdentity: userIdentity,
      isMuted: false,
      notificationNumber: 1
    };
    setOnlineUserList(tempObject);
  };

  return (
    <OnlineUserContext.Provider
      value={{
        onlineUserList,
        incrementNotificationNumber,
        resetNotificationNumber,
        muteOrUnmute,
        deleteUser
      }}>
      {props.children}
    </OnlineUserContext.Provider>
  );
};

export default OnlineUserContextProvider;

// {
//   "virtualmint:08:00:27:fc:3d:f2": {
//     "event": "offline",
//     "ip": "192.168.1.23",
//     "username": "virtualmint",
//     "mac": "08:00:27:fc:3d:f2",
//     "userIdentity": "virtualmint:08:00:27:fc:3d:f2",
//     "isMuted": false,
//     "notificationNumber": 6,
//
//   }
// }
