import React, { useState, useRef, useEffect, useContext } from 'react';

import { byteConverter } from '../../Helpers/byteConverter';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';

import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import ChooseIcon from '../../Helpers/ChooseIcon';

const { shell } = require('electron');

const OldMediaListItem = ({ from, fileName, createdAt, fileSize, downloadDir, fileDir, fileType, fileStatus }) => {
	let tempDir = downloadDir + '/' + fileName;
	if (from === '*MYPC*') {
		tempDir = fileDir;
	}
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

export default OldMediaListItem;
