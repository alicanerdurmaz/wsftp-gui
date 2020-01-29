import React, { useState, useRef, useEffect, useContext } from 'react';

import { byteConverter } from '../../Helpers/byteConverter';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';
import {
	UPLOAD_MEDIA_GET_MSG_FROM_DB,
	DOWNLOAD_MEDIA_GET_MSG_FROM_DB,
	DOWNLOAD_MEDIA_RESET_BY_NAME,
	UPLOAD_MEDIA_RESET_BY_NAME
} from '../../context/types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import ChooseIcon from '../../Helpers/ChooseIcon';
import useOnScreen from '../hooks/useOnScreen';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';

const { shell } = require('electron');

const UpRefOldMediaHistoryListItem = ({
	i,
	from,
	fileName,
	createdAt,
	fileSize,
	downloadDir,
	fileDir,
	fileType,
	fileStatus
}) => {
	let tempDir = downloadDir + '/' + fileName;
	if (from === '*MYPC*') {
		tempDir = fileDir;
	}
	console.log(i);
	const onTopUp = useRef(null);
	const onScreenTopUp = useOnScreen(onTopUp);

	const onTopDown = useRef(null);
	const onScreenDown = useOnScreen(onTopDown);

	const { selectedUser } = useContext(SelectUserContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);
	const { dispatchOldDownloadMediaContext } = useContext(OldDownloadMediaContext);
	const [isExpanded, setIsExpanded] = useState(false);

	const openFileDirectory = () => {
		shell.showItemInFolder(tempDir);
	};

	const btnIsExpanded = e => {
		setIsExpanded(!isExpanded);
	};
	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.sent) {
			return;
		} else {
			return (
				<div className='media-btn-group-1'>
					<TimesIcon className='media-times-icon disabled'></TimesIcon>{' '}
				</div>
			);
		}
	};

	useEffect(() => {
		if (!onScreenTopUp) return;

		dispatchOldUploadMediaContext({
			type: UPLOAD_MEDIA_GET_MSG_FROM_DB,
			userIdentity: selectedUser.userIdentity
		});
	}, [onScreenTopUp]);

	return (
		<li ref={onTopUp} className={`media-list-item ${isExpanded ? 'expanded' : ''}`} onClick={e => btnIsExpanded(e)}>
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
						{createdAt}
						{from === '*MYPC*' || fileStatus === FILE_STATUS.sent ? (
							<span className='show-in-folder' onClick={tempDir ? openFileDirectory : null}>
								show in folder
							</span>
						) : null}
					</span>
					<div className='media-file-dir'>{fileStatus === FILE_STATUS.rejected ? 'rejected' : tempDir}</div>
				</div>
			) : null}
		</li>
	);
};

export default UpRefOldMediaHistoryListItem;
