import React, { createContext, useState, useContext, useEffect } from 'react';
import { MessageContext } from './MessageContext/MessageContext';
import { playNotification } from '../Helpers/playNotificationSound';
import { OnlineUserContext } from './OnlineUserContext/OnlineUserContext';

export const NotificationContext = createContext();

const NotificationProvider = props => {
  // const { messageHistory, lastIncomingMessage } = useContext(MessageContext);
  // const { onlineUserList, incrementNotificationNumber } = useContext(OnlineUserContext);

  // useEffect(() => {
  //   if (onlineUserList[lastIncomingMessage.current] && !onlineUserList[lastIncomingMessage.current].muted) {
  //     playNotification();
  //   }
  //   console.log('incremented');
  //   incrementNotificationNumber(lastIncomingMessage.current);
  // }, [messageHistory]);

  return <NotificationContext.Provider>{props.children}</NotificationContext.Provider>;
};

export default NotificationProvider;
