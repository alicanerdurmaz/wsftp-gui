import React, { useState, useContext } from 'react';
import { byteConverter } from '../../Helpers/byteConverter';

import { ReactComponent as BanIcon } from '../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/check-circle-solid.svg';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';
import { API_killTransaction, commanderSocket } from '../../backend/api/webSocketConnection';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import ChooseIcon from '../../Helpers/ChooseIcon';
import { SettingsContext } from '../../context/SettingsContext';
import { MessageContext } from '../../context/MessageContext/MessageContext';
import { STATUS_CHANGED, DOWNLOAD_MEDIA_STATUS_CHANGED } from '../../context/types';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';
const { shell } = require('electron');

const DownloadMediaListItem = ({
	from,
	fileName,
	createdAt,
	fileSize,
	downloadDir,
	fileDir,
	fileType,
	progress,
	fileStatus,
	mac,
	uuid,
	dbName,
	port,
	username,
	ip,
	nick
}) => {
	let fullPath = downloadDir && downloadDir + '/' + fileName;
	const { settings } = useContext(SettingsContext);
	const { dispatch } = useContext(MessageContext);
	const { dispatchDownloadMediaContext } = useContext(DownloadMediaContext);

	const [isExpanded, setIsExpanded] = useState(false);

	const openFileDirectory = () => {
		shell.showItemInFolder(fullPath);
	};

	const btnAcceptFile = e => {
		e.stopPropagation();
		const tempAcceptRequest = {
			event: 'cacp',
			mac: mac,
			dir: fileDir,
			dest: settings.downloadDirectory || 'desk',
			uuid: uuid,
			ip: ip,
			username: username,
			nick: nick
		};

		commanderSocket.send(JSON.stringify(tempAcceptRequest));
		dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading } });

		dispatchDownloadMediaContext({
			type: DOWNLOAD_MEDIA_STATUS_CHANGED,
			payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading }
		});
	};

	const btnRejectAcceptFile = e => {
		e.stopPropagation();
		const tempRejectRequest = {
			event: 'crej',
			mac: mac,
			dir: fileDir,
			uuid: uuid,
			ip: ip,
			username: username,
			nick: nick
		};
		commanderSocket.send(JSON.stringify(tempRejectRequest));
		dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected } });

		dispatchDownloadMediaContext({
			type: DOWNLOAD_MEDIA_STATUS_CHANGED,
			payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected }
		});
	};

	const btnKillRequest = e => {
		e.stopPropagation();
		API_killTransaction(port);
	};

	const btnIsExpanded = e => {
		setIsExpanded(!isExpanded);
	};

	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.waiting) {
			return (
				<div className='media-btn-group'>
					<CheckIcon className='media-check-icon' onClick={e => btnAcceptFile(e)}></CheckIcon>
					<BanIcon className='media-ban-icon' onClick={e => btnRejectAcceptFile(e)}></BanIcon>
				</div>
			);
		}
		if (fileStatus === FILE_STATUS.rejected) {
			return (
				<div className='media-btn-group-1'>
					<TimesIcon className='media-times-icon disabled'></TimesIcon>{' '}
				</div>
			);
		}
		if (fileStatus === FILE_STATUS.loading) {
			return (
				<div className='media-btn-group'>
					<span className='media-progress'>%{progress}</span>
					{port && <TimesIcon className='media-ban-icon ' onClick={e => btnKillRequest(e)}></TimesIcon>}
				</div>
			);
		}
	};
	return (
		<li className={`media-list-item ${isExpanded ? 'expanded' : ''}`} onClick={e => btnIsExpanded(e)}>
			<div className='media-content'>
				{ChooseIcon(fileType)}
				<div className='media-info'>
					<div className='media-fileName'>{fileName}</div>
					<span className='media-fileSize'>{byteConverter(fileSize)}</span>
				</div>
				{fileInformation()}
			</div>
			{isExpanded ? (
				<div className={`media-expanded-section`} onClick={e => e.stopPropagation(e)}>
					<span className='media-createdAt'>
						{`${createdAt[4]} · ${createdAt[1]} ${createdAt[2]}, ${createdAt[3]}`}
						{fileStatus === FILE_STATUS.loading || fileStatus === FILE_STATUS.sent ? (
							<span className='show-in-folder' onClick={fullPath ? openFileDirectory : null}>
								show in folder
							</span>
						) : null}
					</span>
					<div className='media-file-dir'>
						{fileStatus === FILE_STATUS.rejected ? 'rejected' : fullPath ? fullPath : 'waiting for accept'}
					</div>
				</div>
			) : null}
		</li>
	);
};

export default DownloadMediaListItem;
