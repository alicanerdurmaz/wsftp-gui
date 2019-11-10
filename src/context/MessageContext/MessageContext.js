import React, { createContext, useState, useReducer } from 'react';
import uuid from 'uuid/v4';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket } from '../../backend/api/api';

export const MessageContext = createContext();

const MessageContextProvider = props => {
  const [messageHistory, dispatch] = useReducer(messageReducer, {});

  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);

    if (dataToJson.stat === 'smsg') {
      dispatch({
        type: 'ADD_MESSAGE',
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
        type: 'ADD_MESSAGE',
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
    const fileNameIndex = e.data.indexOf('fileName');
    const tempString = e.data.slice(0, fileNameIndex) + '"' + e.data.slice(fileNameIndex);

    const dataToJson = JSON.parse(tempString);
    console.log(dataToJson);
    if (dataToJson.stat === 'rreq') {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          accepted: false,
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
