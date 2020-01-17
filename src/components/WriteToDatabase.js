import React, { Fragment, useEffect, useContext } from 'react';
import { writeToDataBaseArray, writeObject } from '../backend/api/dbFunctions';
import { MessageContext } from '../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../context/OnlineUserContext/OnlineUserContext';

const { ipcRenderer } = require('electron');

const WriteToDatabase = () => {
  const { messageHistory } = useContext(MessageContext);
  const { onlineUserList } = useContext(OnlineUserContext);

  useEffect(() => {
    const saveToDatabase = () => {
      const readyToWrite = { ...onlineUserList };
      Object.keys(readyToWrite).forEach(key => {
        readyToWrite[key].event = 'offline';
      });

      writeObject('allUsersList.json', './src/database/', readyToWrite);
      Object.keys(messageHistory).length
        ? Object.keys(messageHistory).forEach(key => {
            writeToDataBaseArray(`${key}.json`, './src/database/', messageHistory[key], () => {
              ipcRenderer.send('save-completed');
            });
          })
        : ipcRenderer.send('save-completed');
    };
    ipcRenderer.on('app-close', saveToDatabase);
    return () => {
      ipcRenderer.removeListener('app-close', saveToDatabase);
    };
  }, [messageHistory, onlineUserList]);

  return <Fragment></Fragment>;
};

export default WriteToDatabase;
