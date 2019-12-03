import React, { createContext, useReducer } from 'react';
import uuid from 'uuid/v4';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket } from '../../backend/api/webSocketConnection';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { MESSAGE_ADDED, PROGRESS_CHANGED } from '../types';

export const MessageContext = createContext();

const MessageContextProvider = props => {
  const [messageHistory, dispatch] = useReducer(messageReducer, {});

  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);

    if (dataToJson.event === 'smsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          dbName: dataToJson.username,
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
          dbName: dataToJson.username,
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

    if (dataToJson.event === 'rreq') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          mac: dataToJson.mac,
          fileStatus: FILE_STATUS.waiting,
          dbName: dataToJson.username,
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
          dbName: dataToJson.username,
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
  };

  return <MessageContext.Provider value={{ messageHistory, dispatch }}>{props.children}</MessageContext.Provider>;
};

export default MessageContextProvider;
