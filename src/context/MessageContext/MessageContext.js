import React, { createContext, useReducer, useRef, useEffect } from 'react';
import uuid from 'uuid/v4';

import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket, commanderSocket } from '../../backend/api/webSocketConnection';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { MESSAGE_ADDED, PROGRESS_CHANGED, PROGRESS_DONE, PROGRESS_FAIL } from '../types';
import { API_saveJson, API_getJson, API_SendMessage } from '../../backend/api/webSocketConnection';
import { writeToDataBaseArray } from '../../backend/api/dbFunctions';

const { ipcRenderer } = require('electron');

export const MessageContext = createContext();

const MessageContextProvider = props => {
  const [messageHistory, dispatch] = useReducer(messageReducer, {});
  console.log(messageHistory);
  useEffect(() => {
    const saveToDatabase = () => {
      for (let key in messageHistory) {
        writeToDataBaseArray(`${key}.json`, './src/database/', messageHistory[key], () => {
          ipcRenderer.send('save-completed');
        });
      }
    };
    ipcRenderer.on('app-close', saveToDatabase);
    return () => {
      ipcRenderer.removeListener('app-close', saveToDatabase);
    };
  }, [messageHistory]);

  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);
    const userIdentity = dataToJson.username + ':' + dataToJson.mac;

    if (dataToJson.event === 'smsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          dbName: userIdentity,
          userIdentity: userIdentity,
          mac: dataToJson.mac,
          from: '*MYPC*',
          to: dataToJson.username,
          content: dataToJson.content,
          contentType: dataToJson.contentType,
          createdAt: dateNow(),
          uuid: uuid()
        }
      });
    }
    if (dataToJson.event === 'rmsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          userIdentity: userIdentity,
          dbName: userIdentity,
          from: dataToJson.username,
          to: '*MYPC*',
          content: dataToJson.content,
          contentType: dataToJson.contentType,
          createdAt: dateNow(),
          uuid: uuid()
        }
      });
    }
  };

  srScoket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);
    console.log(dataToJson);

    const userIdentity = dataToJson.username + ':' + dataToJson.mac;

    if (dataToJson.event === 'rreq') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          fileStatus: FILE_STATUS.waiting,
          userIdentity: userIdentity,
          dbName: userIdentity,
          from: dataToJson.username,
          to: '*MYPC*',
          contentType: dataToJson.contentType,
          dir: dataToJson.dir,
          fileName: dataToJson.fileName,
          fileSize: dataToJson.fileSize,
          fileType: dataToJson.fileType,
          ip: dataToJson.ip,
          createdAt: dateNow(),
          current: '0',
          speed: '0',
          progress: 0,
          uuid: dataToJson.tid
        }
      });
    }
    if (dataToJson.event === 'sreq') {
      const userIdentity = dataToJson.username + ':' + dataToJson.mac;
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          from: '*MYPC*',
          dbName: userIdentity,
          userIdentity: userIdentity,
          dir: dataToJson.dir,
          fileName: dataToJson.fileName,
          fileSize: dataToJson.fileSize,
          fileType: dataToJson.fileType,
          contentType: dataToJson.contentType,
          fileStatus: FILE_STATUS.loading,
          to: dataToJson.username,
          ip: dataToJson.ip,
          createdAt: dateNow(),
          current: '0',
          speed: '0',
          progress: 0,
          uuid: dataToJson.tid
        }
      });
    }
    if (dataToJson.event === 'prg') {
      dispatch({
        type: PROGRESS_CHANGED,
        payload: dataToJson
      });
    }
    if (dataToJson.event === 'dprg') {
      dispatch({
        type: PROGRESS_DONE,
        payload: dataToJson
      });
    }
    if (dataToJson.event === 'fprg') {
      dispatch({
        type: PROGRESS_FAIL,
        payload: dataToJson
      });
    }
  };

  return <MessageContext.Provider value={{ messageHistory, dispatch }}>{props.children}</MessageContext.Provider>;
};

export default MessageContextProvider;
