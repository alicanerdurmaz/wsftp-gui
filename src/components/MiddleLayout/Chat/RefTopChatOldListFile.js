import React, { useContext, Fragment, useRef, useEffect } from 'react';

import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';

import { byteConverter } from '../../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../../assets/svg/file-solid.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import useOnScreen from '../../hooks/useOnScreen';

const RefTopChatOldListFile = ({
	fileStatus,
	from,
	createdAt,
	fileSize,
	fileName,
	id,
	scrollDirection,
	getOlderDataFromDb
}) => {
	const refOldListTop = useRef(false);
	const isTopOnScreen = useOnScreen(refOldListTop);

	let tempFrom = 'user';
	if (from !== '*MYPC*') {
		tempFrom = 'other';
	}

	useEffect(() => {
		if (!isTopOnScreen) return;
		else if (scrollDirection > 0) return;
		else {
			getOlderDataFromDb();
		}
	}, [isTopOnScreen]);

	const formattedFileSize = byteConverter(fileSize);

	const fileInformation = () => {
		if (fileStatus === FILE_STATUS.sent) {
			return <CheckIcon className='check-icon'></CheckIcon>;
		} else {
			return <TimesIcon className='times-icon disabled'></TimesIcon>;
		}
	};

	return (
		<Fragment>
			<li className={`file-message-container ${tempFrom}`} id={id} ref={refOldListTop}>
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
					<span className='createdAt-f'>{createdAt && createdAt[4]}</span>
				</span>
			</li>
		</Fragment>
	);
};

export default RefTopChatOldListFile;
