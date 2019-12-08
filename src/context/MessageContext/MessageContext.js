import React, { createContext, useReducer, useEffect, useState } from 'react';
import uuid from 'uuid/v4';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket } from '../../backend/api/webSocketConnection';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { MESSAGE_ADDED, PROGRESS_CHANGED, PROGRESS_DONE, PROGRESS_FAIL } from '../types';

export const MessageContext = createContext();

const MessageContextProvider = props => {
  // const [lastDbName, setLastDbName] = useState(null);
  const [messageHistory, dispatch] = useReducer(messageReducer, {});

  // ,() => {
  //   const localStorageKeys = Object.keys(localStorage);

  //   const tempObject = {};
  //   localStorageKeys.forEach(element => {
  //     try {
  //       tempObject[element] = JSON.parse(localStorage.getItem(element));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   });

  //   return tempObject;
  // });

  // useEffect(() => {
  //   if (lastDbName !== null) {
  //     localStorage.setItem(lastDbName, JSON.stringify(messageHistory[lastDbName]));
  //   }
  // }, [lastDbName, messageHistory]);

  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);
    // setLastDbName(dataToJson.mac);

    if (dataToJson.event === 'smsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          dbName: dataToJson.mac,
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
          dbName: dataToJson.mac,
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
    // setLastDbName(dataToJson.mac);
    if (dataToJson.event === 'rreq') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          fileStatus: FILE_STATUS.waiting,
          dbName: dataToJson.mac,
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
          uuid: uuid()
        }
      });
    }
    if (dataToJson.event === 'sreq') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          from: '*MYPC*',
          dbName: dataToJson.mac,
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
          uuid: uuid()
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
