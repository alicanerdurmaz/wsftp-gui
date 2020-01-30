import React, { Fragment } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';

import { byteConverter } from '../../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../../assets/svg/file-solid.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';

const ChatOldListFileMessage = ({ fileStatus, from, createdAt, fileSize, fileName, id }) => {
	let tempFrom = 'user';
	if (from !== '*MYPC*') {
		tempFrom = 'other';
	}
	const formattedFileSize = byteConverter(fileSize);

	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.sent) {
			return <CheckIcon className='check-icon'></CheckIcon>;
		} else {
			return <TimesIcon className='times-icon disabled'></TimesIcon>;
		}
	};

	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
	};

	return (
		<Fragment>
			<li className={`file-message-container ${tempFrom}`} id={id}>
				<div className={`file-message-content ${tempFrom}`}>
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
					<Tooltip title={createdAtToText()} placement='bottom' interactive>
						<span className='createdAt-f'>{createdAt && createdAt[4]}</span>
					</Tooltip>
				</span>
			</li>
		</Fragment>
	);
};

export default ChatOldListFileMessage;