import React, { createContext, useState, useContext } from 'react';
import { MessageContext } from '../MessageContext/MessageContext';
import { hsSocket } from '../../backend/api/webSocketConnection';
import { USER_CREATED } from '../types';

export const OnlineUserContext = createContext();

const OnlineUserContextProvider = props => {
  const [onlineUserList, setOnlineUserList] = useState([]);
  const { messageHistory, dispatch } = useContext(MessageContext);

  hsSocket.onmessage = msg => {
    const toJson = JSON.parse(msg.data);
    const macAddress = toJson.mac;

    if (!messageHistory.hasOwnProperty(macAddress)) {
      dispatch({ type: USER_CREATED, macAddress: macAddress });
    }

    setOnlineUserList({
      ...onlineUserList,
      [macAddress]: {
        ...toJson
      }
    });
  };

  return <OnlineUserContext.Provider value={{ onlineUserList }}>{props.children}</OnlineUserContext.Provider>;
};

export default OnlineUserContextProvider;
