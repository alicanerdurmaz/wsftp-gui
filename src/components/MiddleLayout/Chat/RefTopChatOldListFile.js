import React, { useContext, Fragment, useRef, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
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
			return <span className='sent-text'>done</span>;
		}
		if (fileStatus === FILE_STATUS.canceled) {
			return <span className='canceled-text'>canceled</span>;
		} else {
			return <span className='rejected-text'>rejected</span>;
		}
	};

	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
	};
	return (
		<Fragment>
			<li className={`file-message-container ${tempFrom}`} id={id} ref={refOldListTop}>
				<div className={`file-message-content ${tempFrom}`}>
					<FileIcon className='file-icon'></FileIcon>
					<div className='file-info'>
						<span className='file-name'>{fileName}</span>
						<span className='file-size'>
							{formattedFileSize}

							<Tooltip title={createdAtToText()} placement='left' interactive>
								<span className='createdAt-f'>{createdAt && ' ~ ' + createdAt[4]}</span>
							</Tooltip>
						</span>
					</div>

					{fileInformation()}
				</div>
			</li>
		</Fragment>
	);
};

export default RefTopChatOldListFile;
