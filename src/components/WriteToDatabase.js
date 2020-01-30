import React, { Fragment, useEffect, useContext } from 'react';
import { writeToDataBaseArray, writeObject } from '../backend/api/dbFunctions';
import { MessageContext } from '../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../context/OnlineUserContext/OnlineUserContext';
import { SettingsContext } from '../context/SettingsContext';
import findDbDirectory from '../Helpers/findDbDirectory';
import { UploadMediaContext } from '../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../context/MediaContext/DownloadMediaContext';
import FILE_STATUS from '../config/CONFIG_FILE_STATUS';
import { API_CancelUpload } from '../backend/api/webSocketConnection';
import { sleep } from '../Helpers/sleep';

const { ipcRenderer } = require('electron');

const WriteToDatabase = () => {
	const { messageHistory } = useContext(MessageContext);
	const { onlineUserList } = useContext(OnlineUserContext);
	const { uploadMediaList } = useContext(UploadMediaContext);
	const { downloadMediaList } = useContext(DownloadMediaContext);
	const { settings } = useContext(SettingsContext);

	useEffect(() => {
		const saveToDatabase = async () => {
			const keys = Object.keys(uploadMediaList);
			for (let i = 0; i < keys.length; i++) {
				for (let j = 0; j < uploadMediaList[keys[i]].length; j++) {
					if (uploadMediaList[keys[i]][j].fileStatus === FILE_STATUS.waiting) {
						const tempCancelRequest = {
							event: 'cncl',
							mac: uploadMediaList[keys[i]][j].mac,
							dir: uploadMediaList[keys[i]][j].dir,
							uuid: uploadMediaList[keys[i]][j].uuid,
							ip: uploadMediaList[keys[i]][j].ip,
							username: uploadMediaList[keys[i]][j].username,
							nick: uploadMediaList[keys[i]][j].nick
						};
						API_CancelUpload(tempCancelRequest);
						await sleep(100);
					}
				}
			}

			const allUsersListJson = { ...onlineUserList };
			const settingsJson = { ...settings };
			Object.keys(allUsersListJson).forEach(key => {
				allUsersListJson[key].event = 'offline';
			});
			writeObject('settings.json', findDbDirectory(), settingsJson);
			writeObject('allUsersList.json', findDbDirectory(), allUsersListJson);

			// message history
			Object.keys(messageHistory).length
				? Object.keys(messageHistory).forEach(key => {
						writeToDataBaseArray(`${key}.json`, findDbDirectory(), messageHistory[key], () => {
							/// upload media list
							Object.keys(uploadMediaList).length
								? Object.keys(uploadMediaList).forEach(key => {
										writeToDataBaseArray(
											`${key}.json`,
											findDbDirectory(),
											uploadMediaList[key],
											() => {
												// download media list
												Object.keys(downloadMediaList).length
													? Object.keys(downloadMediaList).forEach(key => {
															writeToDataBaseArray(
																`${key}.json`,
																findDbDirectory(),
																downloadMediaList[key],
																() => {
																	ipcRenderer.send('save-completed');
																}
															);
													  })
													: ipcRenderer.send('save-completed');
											}
										);
								  })
								: ipcRenderer.send('save-completed');
						});
				  })
				: ipcRenderer.send('save-completed');
		};
		ipcRenderer.on('app-close', saveToDatabase);
		return () => {
			ipcRenderer.removeListener('app-close', saveToDatabase);
		};
	}, [messageHistory, onlineUserList, settings, uploadMediaList, downloadMediaList]);

	return <Fragment></Fragment>;
};

export default WriteToDatabase;
