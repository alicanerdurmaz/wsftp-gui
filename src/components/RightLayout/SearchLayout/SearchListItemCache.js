import React, { Fragment } from 'react';
import ChooseIcon from '../../../Helpers/ChooseIcon';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import { ReactComponent as WaitingIcon } from '../../../assets/svg/clock-regular.svg';
import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';

const fileStatusIcon = fileStatus => {
	if (fileStatus === FILE_STATUS.waiting || fileStatus === FILE_STATUS.loading) {
		return <WaitingIcon className='waiting-icon-search'></WaitingIcon>;
	}
	if (fileStatus === FILE_STATUS.rejected) {
		return <TimesIcon className='times-icon-search'></TimesIcon>;
	}

	if (fileStatus === FILE_STATUS.sent) {
		return <CheckIcon className='check-icon-search'></CheckIcon>;
	}
};

const SearchListItemCache = ({ from, contentType, fileName, content, fileStatus, fileType }) => {
	let user = 'user';
	if (from !== '*MYPC*') {
		user = 'other';
	}
	function createMarkup(markup) {
		return { __html: markup };
	}

	return (
		<Fragment>
			{contentType === 'text' ? (
				// TEXT MESSAGE
				<div className={`search-list-group-item-text ${user}`}>
					<div className='search-list-text' dangerouslySetInnerHTML={createMarkup(content)}></div>
				</div>
			) : (
				// FILE MESSAGE
				<div className={`search-list-group-item-file ${user}`}>
					{user === 'other' ? (
						<div className='search-list-file-name-icon-group other'>
							{ChooseIcon(fileType, 'search-layout-file-icon')}
							<div
								className='search-list-filename other'
								dangerouslySetInnerHTML={createMarkup(fileName)}></div>
							<span className='other-icon'>{fileStatusIcon(fileStatus)}</span>
						</div>
					) : (
						<div className='search-list-file-name-icon-group user'>
							<span className='user-icon'>{fileStatusIcon(fileStatus)}</span>
							<div
								className='search-list-filename user'
								dangerouslySetInnerHTML={createMarkup(fileName)}></div>

							{ChooseIcon(fileType, 'search-layout-file-icon')}
						</div>
					)}
				</div>
			)}
		</Fragment>
	);
};

export default SearchListItemCache;
