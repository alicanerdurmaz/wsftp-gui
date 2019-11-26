import React, { createContext, useState, useContext } from 'react';
import { MessageContext } from '../MessageContext/MessageContext';
import { hsSocket } from '../../backend/api/api';
import { USER_CREATED } from '../types';

export const OnlineUserContext = createContext();

const OnlineUserContextProvider = props => {
  const [onlineUserList, setOnlineUserList] = useState([]);
  const { messageHistory, dispatch } = useContext(MessageContext);

  hsSocket.onmessage = msg => {
    const toJson = JSON.parse(msg.data);
    const tempName = toJson.username;
    if (!messageHistory.hasOwnProperty(tempName)) {
      dispatch({ type: USER_CREATED, username: tempName });
    }

    setOnlineUserList({
      ...onlineUserList,
      [tempName]: {
        ...toJson
      }
    });
  };

  return <OnlineUserContext.Provider value={{ onlineUserList }}>{props.children}</OnlineUserContext.Provider>;
};

export default OnlineUserContextProvider;
