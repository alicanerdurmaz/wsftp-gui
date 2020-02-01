import React, { useState, useRef, useEffect, useContext } from 'react';

import { byteConverter } from '../../Helpers/byteConverter';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/check-solid.svg';
import { UPLOAD_MEDIA_GET_MSG_FROM_DB } from '../../context/types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import ChooseIcon from '../../Helpers/ChooseIcon';
import useOnScreen from '../hooks/useOnScreen';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';

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
	let tempDir = false;
	if (downloadDir) {
		tempDir = downloadDir + '/' + fileName;
	}
	if (from === '*MYPC*') {
		tempDir = fileDir;
	}

	const onTopUp = useRef(null);
	const onScreenTopUp = useOnScreen(onTopUp);

	const { selectedUser } = useContext(SelectUserContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);

	const [isExpanded, setIsExpanded] = useState(false);

	const openFileDirectory = () => {
		shell.showItemInFolder(tempDir);
	};

	const btnIsExpanded = e => {
		setIsExpanded(!isExpanded);
	};
	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.sent) {
			return (
				<div className='media-btn-group-1'>
					<CheckIcon className='media-sent-icon disabled'></CheckIcon>
				</div>
			);
		} else if (fileStatus === FILE_STATUS.canceled) {
			return (
				<div className='media-btn-group-1'>
					<TimesIcon className='media-times-icon disabled' style={{ fill: '#46cdcf' }}></TimesIcon>
				</div>
			);
		} else {
			return (
				<div className='media-btn-group-1'>
					<TimesIcon className='media-times-icon disabled'></TimesIcon>
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

	const openFile = () => {
		if (!tempDir) {
			return;
		}
		shell.openItem(tempDir);
	};

	return (
		<li ref={onTopUp} className={`media-list-item ${isExpanded ? 'expanded' : ''}`} onClick={e => btnIsExpanded(e)}>
			<div className='media-content'>
				{ChooseIcon(fileType)}
				<div className='media-info'>
					<div
						className={`media-fileName ${tempDir ? '' : 'strike-text'}`}
						onDoubleClick={openFile}
						onClick={e => e.stopPropagation(e)}>
						{fileName}
					</div>
					<span className='media-fileSize'>{byteConverter(fileSize)}</span>
				</div>
				{fileInformation()}
			</div>
			{isExpanded ? (
				<div className={`media-expanded-section`} onClick={e => e.stopPropagation(e)}>
					<span className='media-createdAt'>
						{`${createdAt[4]} · ${createdAt[1]} ${createdAt[2]}, ${createdAt[3]}`}
						{from === '*MYPC*' || fileStatus === FILE_STATUS.sent ? (
							<span className='show-in-folder' onClick={tempDir ? openFileDirectory : null}>
								show in folder
							</span>
						) : null}
					</span>
					<div className='media-file-dir'>
						{fileStatus === FILE_STATUS.rejected
							? 'rejected'
							: fileStatus === FILE_STATUS.canceled
							? 'canceled'
							: tempDir}
					</div>
				</div>
			) : null}
		</li>
	);
};

export default UpRefOldMediaHistoryListItem;
