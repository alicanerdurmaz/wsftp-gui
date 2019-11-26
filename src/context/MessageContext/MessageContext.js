import React, { createContext, useReducer } from 'react';
import uuid from 'uuid/v4';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket } from '../../backend/api/api';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { MESSAGE_ADDED } from '../types';

export const MessageContext = createContext();

const MessageContextProvider = props => {
  const [messageHistory, dispatch] = useReducer(messageReducer, {});

  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);

    if (dataToJson.stat === 'smsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          dbName: dataToJson.person,
          from: '*MYPC*',
          to: dataToJson.person,
          content: dataToJson.content,
          contentType: dataToJson.contentType,
          createdAt: dateNow(),
          uuid: uuid()
        }
      });
    }
    if (dataToJson.stat === 'rmsg') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
          dbName: dataToJson.person,
          from: dataToJson.person,
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
    if (dataToJson.stat === 'rreq') {
      dispatch({
        type: MESSAGE_ADDED,
        payload: {
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
          uuid: uuid()
        }
      });
    }
  };

  return <MessageContext.Provider value={{ messageHistory, dispatch }}>{props.children}</MessageContext.Provider>;
};

export default MessageContextProvider;
