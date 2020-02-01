import React, { useContext, Fragment, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { STATUS_CHANGED, UPLOAD_MEDIA_STATUS_CHANGED, DOWNLOAD_MEDIA_STATUS_CHANGED } from '../../../context/types';
import { byteConverter } from '../../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../../assets/svg/file-solid.svg';
import { ReactComponent as BanIcon } from '../../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckCircleIcon } from '../../../assets/svg/check-circle-solid.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import { API_killTransaction, commanderSocket, API_CancelUpload } from '../../../backend/api/webSocketConnection';
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
	port,
	username,
	ip,
	nick
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
				uuid: uuid,
				ip: ip,
				username: username,
				nick: nick
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
				uuid: uuid,
				ip: ip,
				username: username,
				nick: nick
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
	const sendCancelUpload = () => {
		const tempCancelRequest = {
			event: 'cncl',
			mac: mac,
			dir: dir,
			uuid: uuid,
			ip: ip,
			username: username,
			nick: nick
		};
		API_CancelUpload(tempCancelRequest);
	};
	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.waiting) {
			if (tempFrom === 'user') {
				return (
					<div className='btn-group'>
						<div className='progress-text-container'>
							<span className='progress-text'>%{progress}</span>
						</div>
						<TimesIcon className='times-icon-cancel-upload' onClick={sendCancelUpload}></TimesIcon>
					</div>
				);
			} else
				return (
					<div className='btn-group'>
						<CheckIcon className='check-icon' onClick={() => setAccepted(true)}></CheckIcon>
						<TimesIcon className='times-icon' onClick={() => setAccepted(false)}></TimesIcon>
					</div>
				);
		}
		if (fileStatus === FILE_STATUS.rejected) {
			return <span className='rejected-text'>rejected</span>;
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
			return <span className='sent-text'>done</span>;
		}
		if (fileStatus === FILE_STATUS.canceled) {
			return <span className='canceled-text'>canceled</span>;
		}
	};
	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
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
					<Tooltip title={createdAtToText()} placement='left' interactive>
						<span className='createdAt-f'>{createdAt && createdAt[4]}</span>
					</Tooltip>
				</span>
			</li>
		</Fragment>
	);
};

export default ChatFileMessage;
