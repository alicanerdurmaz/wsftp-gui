import React, { useContext, Fragment, useState } from 'react';

import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { STATUS_CHANGED, UPLOAD_MEDIA_STATUS_CHANGED, DOWNLOAD_MEDIA_STATUS_CHANGED } from '../../../context/types';
import { byteConverter } from '../../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../../assets/svg/file-solid.svg';
import { ReactComponent as BanIcon } from '../../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckCircleIcon } from '../../../assets/svg/check-circle-solid.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import { API_killTransaction, commanderSocket } from '../../../backend/api/webSocketConnection';
import { SettingsContext } from '../../../context/SettingsContext';
import { UploadMediaContext } from '../../../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../../../context/MediaContext/DownloadMediaContext';

const ChatFileMessage = ({
	fileStatus,
	from,
	createdAt,
	fileSize,
	fileName,
	dir,
	uuid,
	dbName,
	progress,
	mac,
	port
}) => {
	const { dispatch } = useContext(MessageContext);
	const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
	const { dispatchDownloadMediaContext } = useContext(DownloadMediaContext);
	const { settings } = useContext(SettingsContext);
	const [showCancel, setShowCancel] = useState(false);

	let tempFrom = 'user';
	if (from !== '*MYPC*') {
		tempFrom = 'other';
	}
	const formattedFileSize = byteConverter(fileSize);

	const setAccepted = action => {
		if (action) {
			const tempAcceptRequest = {
				event: 'cacp',
				mac: mac,
				dir: dir,
				dest: settings.downloadDirectory || 'desk',
				uuid: uuid
			};

			commanderSocket.send(JSON.stringify(tempAcceptRequest));
			dispatch({
				type: STATUS_CHANGED,
				payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading }
			});

			dispatchDownloadMediaContext({
				type: DOWNLOAD_MEDIA_STATUS_CHANGED,
				payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading }
			});
		}
		if (!action) {
			const tempRejectRequest = {
				event: 'crej',
				mac: mac,
				dir: dir,
				uuid: uuid
			};
			commanderSocket.send(JSON.stringify(tempRejectRequest));
			dispatch({
				type: STATUS_CHANGED,
				payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected }
			});

			dispatchDownloadMediaContext({
				type: DOWNLOAD_MEDIA_STATUS_CHANGED,
				payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected }
			});
		}
	};
	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.waiting) {
			return (
				<div className='btn-group'>
					<CheckCircleIcon className='check-icon' onClick={() => setAccepted(true)}></CheckCircleIcon>
					<BanIcon className='ban-icon' onClick={() => setAccepted(false)}></BanIcon>
				</div>
			);
		}
		if (fileStatus === FILE_STATUS.rejected) {
			return <TimesIcon className='times-icon disabled'></TimesIcon>;
		}
		if (fileStatus === FILE_STATUS.loading && !showCancel) {
			return (
				<div className='progress-text-container'>
					<span className='progress-text'>%{progress}</span>
				</div>
			);
		}
		if (fileStatus === FILE_STATUS.loading && showCancel) {
			return <TimesIcon className='times-icon-cancelprg' onClick={e => API_killTransaction(port)}></TimesIcon>;
		}
		if (fileStatus === FILE_STATUS.sent) {
			return <CheckIcon className='check-icon'></CheckIcon>;
		}
	};

	return (
		<Fragment>
			<li
				id={uuid}
				className={`file-message-container ${tempFrom}`}
				onMouseEnter={port ? e => setShowCancel(true) : null}
				onMouseLeave={port ? e => setShowCancel(false) : null}>
				<div
					className={`file-message-content ${tempFrom}`}
					style={{
						background:
							fileStatus === FILE_STATUS.loading
								? `linear-gradient(90deg, #6ab8959c ${progress}%, #2f3136 1%)`
								: null
					}}>
					<FileIcon className='file-icon'></FileIcon>
					<div className='file-info'>
						<span className='file-name'>{fileName}</span>
						<span className='file-size'>{formattedFileSize}</span>
					</div>
					{fileInformation()}
				</div>
			</li>
			<li className='li-date'>
				<span className={`file-message-createdAt ${tempFrom}`}>
					<span className='createdAt-f'>{createdAt[4]}</span>
				</span>
			</li>
		</Fragment>
	);
};

export default ChatFileMessage;
