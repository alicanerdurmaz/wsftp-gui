import React, { createContext, useReducer, useRef, useState, useContext } from 'react';
import uuid from 'uuid/v4';

import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { messageReducer } from './messageReducer';
import { dateNow } from '../../Helpers/newDate';
import { msgSocket, srScoket, API_getActiveTransaction } from '../../backend/api/webSocketConnection';
import {
	MESSAGE_ADDED,
	PROGRESS_CHANGED,
	PROGRESS_DONE,
	PROGRESS_FAIL,
	STATUS_CHANGED,
	UPLOAD_MEDIA_MSG_ADDED,
	UPLOAD_MEDIA_PROGRESS_CHANGED,
	UPLOAD_MEDIA_PROGRESS_DONE,
	UPLOAD_MEDIA_PROGRESS_FAIL,
	DOWNLOAD_MEDIA_MSG_ADDED,
	DOWNLOAD_ADD_DOWNLOAD_DIR,
	DOWNLOAD_MEDIA_PROGRESS_CHANGED,
	DOWNLOAD_MEDIA_PROGRESS_DONE,
	DOWNLOAD_MEDIA_PROGRESS_FAIL,
	DOWNLOAD_MEDIA_STATUS_CHANGED,
	UPLOAD_MEDIA_STATUS_CHANGED
} from '../types';

import { SettingsContext } from '../SettingsContext';
import { UploadMediaContext } from '../MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../MediaContext/DownloadMediaContext';

import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
	allUsersList = JSON.parse(rawData);
} catch (error) {}

export const MessageContext = createContext();
const MessageContextProvider = props => {
	const [messageHistory, dispatch] = useReducer(messageReducer, {});

	const { settings, setSettings } = useContext(SettingsContext);
	const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
	const { dispatchDownloadMediaContext } = useContext(DownloadMediaContext);

	const lastIncomingMessage = useRef(false);

	msgSocket.onmessage = function(e) {
		const dataToJson = JSON.parse(e.data);

		const userIdentity = dataToJson.username + ':' + dataToJson.mac;

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
		lastIncomingMessage.current = false;
		if (dataToJson.event === 'my') {
			const temp = { ...settings };
			temp.myInfo = dataToJson;
			setSettings(temp);
			return;
		}
		const userIdentity = dataToJson.username + ':' + dataToJson.mac;
		console.log(dataToJson);
		if (dataToJson.event === 'rreq') {
			lastIncomingMessage.current = userIdentity;

			dispatch({
				type: MESSAGE_ADDED,
				payload: {
					mac: dataToJson.mac,
					fileStatus: FILE_STATUS.waiting,
					userIdentity: userIdentity,
					dbName: userIdentity,
					nick: dataToJson.nick,
					username: dataToJson.username,
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
					nick: dataToJson.nick,
					username: dataToJson.username,
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
					nick: dataToJson.nick,
					username: dataToJson.username,
					mac: dataToJson.mac,
					from: '*MYPC*',
					dbName: userIdentity,
					userIdentity: userIdentity,
					dir: dataToJson.dir,
					fileName: dataToJson.fileName,
					fileSize: dataToJson.fileSize,
					fileType: dataToJson.fileType,
					contentType: dataToJson.contentType,
					fileStatus: FILE_STATUS.waiting,
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
					nick: dataToJson.nick,
					username: dataToJson.username,
					mac: dataToJson.mac,
					from: '*MYPC*',
					dbName: userIdentity,
					userIdentity: userIdentity,
					dir: dataToJson.dir,
					fileName: dataToJson.fileName,
					fileSize: dataToJson.fileSize,
					fileType: dataToJson.fileType,
					contentType: dataToJson.contentType,
					fileStatus: FILE_STATUS.waiting,
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
			lastIncomingMessage.current = false;
			dispatch({
				type: STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: userIdentity,
					fileStatus: FILE_STATUS.rejected,
					cause: dataToJson.cause
				}
			});
			dispatchDownloadMediaContext({
				type: DOWNLOAD_MEDIA_STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: userIdentity,
					fileStatus: FILE_STATUS.rejected,
					nick: dataToJson.nick,
					username: dataToJson.username,
					cause: dataToJson.cause
				}
			});
			dispatchUploadMediaContext({
				type: UPLOAD_MEDIA_STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: userIdentity,
					fileStatus: FILE_STATUS.rejected,
					nick: dataToJson.nick,
					username: dataToJson.username,
					cause: dataToJson.cause
				}
			});
		}

		if (dataToJson.event === 'scncl') {
			lastIncomingMessage.current = false;
			dispatch({
				type: STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.canceled
				}
			});
			dispatchUploadMediaContext({
				type: UPLOAD_MEDIA_STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.canceled
				}
			});
		}

		if (dataToJson.event === 'rcncl') {
			lastIncomingMessage.current = false;
			dispatch({
				type: STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.canceled
				}
			});
			dispatchDownloadMediaContext({
				type: DOWNLOAD_MEDIA_STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.canceled
				}
			});
		}

		if (dataToJson.event === 'prg') {
			lastIncomingMessage.current = false;
			dispatch({
				type: PROGRESS_CHANGED,
				payload: dataToJson
			});
			if (dataToJson.type === 'upload')
				dispatchUploadMediaContext({
					type: UPLOAD_MEDIA_PROGRESS_CHANGED,
					payload: dataToJson
				});
			if (dataToJson.type === 'download')
				dispatchDownloadMediaContext({
					type: DOWNLOAD_MEDIA_PROGRESS_CHANGED,
					payload: dataToJson
				});
		}
		if (dataToJson.event === 'dprg') {
			lastIncomingMessage.current = false;
			dispatch({
				type: PROGRESS_DONE,
				payload: dataToJson
			});
			if (dataToJson.type === 'upload')
				dispatchUploadMediaContext({
					type: UPLOAD_MEDIA_PROGRESS_DONE,
					payload: dataToJson
				});
			if (dataToJson.type === 'download')
				dispatchDownloadMediaContext({
					type: DOWNLOAD_MEDIA_PROGRESS_DONE,
					payload: dataToJson
				});
		}
		if (dataToJson.event === 'fprg') {
			lastIncomingMessage.current = false;
			dispatch({
				type: PROGRESS_FAIL,
				payload: dataToJson
			});
			if (dataToJson.type === 'upload')
				dispatchUploadMediaContext({
					type: UPLOAD_MEDIA_PROGRESS_FAIL,
					payload: dataToJson
				});
			if (dataToJson.type === 'download')
				dispatchDownloadMediaContext({
					type: DOWNLOAD_MEDIA_PROGRESS_FAIL,
					payload: dataToJson
				});
		}
		if (dataToJson.event === 'sacp') {
			lastIncomingMessage.current = false;
			dispatchDownloadMediaContext({
				type: DOWNLOAD_ADD_DOWNLOAD_DIR,
				payload: {
					username: dataToJson.username,
					mac: dataToJson.mac,
					dest: dataToJson.dest,
					uuid: dataToJson.uuid
				}
			});
		}
		if (dataToJson.event === 'racp') {
			lastIncomingMessage.current = false;
			dispatch({
				type: STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.loading
				}
			});
			dispatchUploadMediaContext({
				type: UPLOAD_MEDIA_STATUS_CHANGED,
				payload: {
					uuid: dataToJson.uuid,
					dbName: dataToJson.username + ':' + dataToJson.mac,
					fileStatus: FILE_STATUS.loading
				}
			});
		}

		if (dataToJson.event === 'actv') {
			const tempObj = { ...settings };
			tempObj.activeTransactions = {
				total: dataToJson.total,
				active: dataToJson.active
			};
		}

		if (dataToJson.event === 'info') {
		}

		if (dataToJson.event !== 'prg' && dataToJson.event !== 'actv') {
			API_getActiveTransaction();
		}
	};

	return (
		<MessageContext.Provider value={{ messageHistory, dispatch, lastIncomingMessage }}>
			{props.children}
		</MessageContext.Provider>
	);
};

export default MessageContextProvider;
