import React, { createContext, useReducer, useRef, useState, useContext } from 'react';
import uuid from 'uuid/v4';

import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket } from '../../backend/api/webSocketConnection';
import {
  MESSAGE_ADDED,
  PROGRESS_CHANGED,
  PROGRESS_DONE,
  PROGRESS_FAIL,
  STATUS_CHANGED,
  UPLOAD_MEDIA_MSG_ADDED,
  UPLOAD_MEDIA_STATUS_CHANGED,
  UPLOAD_MEDIA_PROGRESS_CHANGED,
  UPLOAD_MEDIA_PROGRESS_DONE,
  UPLOAD_MEDIA_PROGRESS_FAIL,
  DOWNLOAD_MEDIA_MSG_ADDED,
  DOWNLOAD_ADD_DOWNLOAD_DIR,
  DOWNLOAD_MEDIA_PROGRESS_CHANGED,
  DOWNLOAD_MEDIA_PROGRESS_DONE,
  DOWNLOAD_MEDIA_PROGRESS_FAIL,
  DOWNLOAD_MEDIA_STATUS_CHANGED
} from '../types';

import { playNotification } from '../../Helpers/playNotificationSound';
import { SettingsContext } from '../SettingsContext';
import { UploadMediaContext } from '../MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../MediaContext/DownloadMediaContext';

export const MessageContext = createContext();

const MessageContextProvider = props => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
  const { dispatchDownloadMediaContext } = useContext(DownloadMediaContext);
  const [messageHistory, dispatch] = useReducer(messageReducer, {});
  const [newUser, setNewUser] = useState(false);
  const lastIncomingMessage = useRef(false);

  const isThisNewUser = userIdentity => {
    if (!messageHistory.hasOwnProperty(userIdentity)) {
      setNewUser(userIdentity);
    }
  };
  msgSocket.onmessage = function(e) {
    const dataToJson = JSON.parse(e.data);
    const userIdentity = dataToJson.username + ':' + dataToJson.mac;
    isThisNewUser(userIdentity);
    if (dataToJson.event === 'smsg') {
      lastIncomingMessage.current = false;
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
      lastIncomingMessage.current = userIdentity;
      playNotification();
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

    if (dataToJson.event === 'my') {
      const temp = { ...settings };
      temp.myInfo = dataToJson;
      setSettings(temp);
      return;
    }
    const userIdentity = dataToJson.username + ':' + dataToJson.mac;
    if (dataToJson.event === 'rreq') {
      lastIncomingMessage.current = userIdentity;
      playNotification();
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
          uuid: dataToJson.uuid
        }
      });
      dispatchDownloadMediaContext({
        type: DOWNLOAD_MEDIA_MSG_ADDED,
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
          uuid: dataToJson.uuid
        }
      });
    }
    if (dataToJson.event === 'sreq') {
      const userIdentity = dataToJson.username + ':' + dataToJson.mac;
      lastIncomingMessage.current = false;
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
          uuid: dataToJson.uuid
        }
      });
      dispatchUploadMediaContext({
        type: UPLOAD_MEDIA_MSG_ADDED,
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
          uuid: dataToJson.uuid
        }
      });
    }
    if (dataToJson.event === 'rrej') {
      console.log(dataToJson);
      dispatch({
        type: STATUS_CHANGED,
        payload: { uuid: dataToJson.uuid, dbName: userIdentity, fileStatus: FILE_STATUS.rejected }
      });
      dispatchUploadMediaContext({
        type: UPLOAD_MEDIA_STATUS_CHANGED,
        payload: { uuid: dataToJson.uuid, dbName: userIdentity, fileStatus: FILE_STATUS.rejected }
      });
      dispatchDownloadMediaContext({
        type: DOWNLOAD_MEDIA_STATUS_CHANGED,
        payload: { uuid: dataToJson.uuid, dbName: userIdentity, fileStatus: FILE_STATUS.rejected }
      });
    }
    if (dataToJson.event === 'prg') {
      console.log(dataToJson);
      dispatch({
        type: PROGRESS_CHANGED,
        payload: dataToJson
      });
      dispatchUploadMediaContext({
        type: UPLOAD_MEDIA_PROGRESS_CHANGED,
        payload: dataToJson
      });
      dispatchDownloadMediaContext({
        type: DOWNLOAD_MEDIA_PROGRESS_CHANGED,
        payload: dataToJson
      });
    }
    if (dataToJson.event === 'dprg') {
      dispatch({
        type: PROGRESS_DONE,
        payload: dataToJson
      });
      dispatchUploadMediaContext({
        type: UPLOAD_MEDIA_PROGRESS_DONE,
        payload: dataToJson
      });
      dispatchDownloadMediaContext({
        type: DOWNLOAD_MEDIA_PROGRESS_DONE,
        payload: dataToJson
      });
    }
    if (dataToJson.event === 'fprg') {
      dispatch({
        type: PROGRESS_FAIL,
        payload: dataToJson
      });
      dispatchUploadMediaContext({
        type: UPLOAD_MEDIA_PROGRESS_FAIL,
        payload: dataToJson
      });
      dispatchDownloadMediaContext({
        type: DOWNLOAD_MEDIA_PROGRESS_FAIL,
        payload: dataToJson
      });
    }
    if (dataToJson.event === 'sacp') {
      dispatchDownloadMediaContext({
        type: DOWNLOAD_ADD_DOWNLOAD_DIR,
        payload: {
          username: dataToJson.username,
          mac: dataToJson.mac,
          destination: dataToJson.destination,
          uuid: dataToJson.uuid
        }
      });
    }
  };

  return (
    <MessageContext.Provider value={{ messageHistory, dispatch, lastIncomingMessage, newUser }}>{props.children}</MessageContext.Provider>
  );
};

export default MessageContextProvider;
