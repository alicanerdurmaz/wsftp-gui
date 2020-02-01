import React, { useState, useContext, useEffect } from 'react';
import { ReactComponent as ThreeDot } from '../../assets/svg/ellipsis-v-solid.svg';
import UploadThreeDotDropDown from './ThreeDotDropDown';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import {
	UPLOAD_MEDIA_DELETE_DB,
	UPLOAD_MEDIA_USER_DELETED,
	UPLOAD_DELETE_BY_KEY_VALUE,
	OLD_UPLOAD_DELETE_BY_KEY_VALUE,
	DOWNLOAD_DELETE_BY_KEY_VALUE,
	OLD_DOWNLOAD_DELETE_BY_KEY_VALUE
} from '../../context/types';
import findDbDirectory from '../../Helpers/findDbDirectory';
import { deleteDataBaseSync, deleteFromDataBase } from '../../backend/api/dbFunctions';

const ThreeDotButton = ({ scrollToDownloadList, scrollToUploadList, type }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { selectedUser } = useContext(SelectUserContext);
	const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);
	const { downloadMediaList, dispatchDownloadMediaContext } = useContext(DownloadMediaContext);
	const { oldDownloadMediaList, dispatchOldDownloadMediaContext } = useContext(OldDownloadMediaContext);

	const btnOpenDropDownHandler = e => {
		e.preventDefault();
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteAll = () => {
		if (type === 'upload') {
			dispatchUploadMediaContext({
				type: UPLOAD_MEDIA_USER_DELETED,
				userIdentity: selectedUser.userIdentity
			});
			dispatchOldUploadMediaContext({
				type: UPLOAD_MEDIA_DELETE_DB,
				userIdentity: selectedUser.userIdentity
			});
			deleteDataBaseSync(`media:upload:${selectedUser.userIdentity}.json`, findDbDirectory());
		}
	};

	const deleteByKeyValue = (key, value) => {
		setAnchorEl(null);

		if (type === 'upload') {
			deleteFromDataBase(`media:upload:${selectedUser.userIdentity}.json`, findDbDirectory(), key, value);
			dispatchOldUploadMediaContext({
				type: OLD_UPLOAD_DELETE_BY_KEY_VALUE,
				userIdentity: selectedUser.userIdentity,
				key: key,
				value: value
			});
			scrollToUploadList('auto');
			dispatchUploadMediaContext({
				type: UPLOAD_DELETE_BY_KEY_VALUE,
				userIdentity: selectedUser.userIdentity,
				key: key,
				value: value
			});
		}

		if (type === 'download') {
			deleteFromDataBase(`media:download:${selectedUser.userIdentity}.json`, findDbDirectory(), key, value);
			deleteFromDataBase(`media:download:${selectedUser.userIdentity}.json`, findDbDirectory(), key, 0);

			dispatchOldDownloadMediaContext({
				type: OLD_DOWNLOAD_DELETE_BY_KEY_VALUE,
				userIdentity: selectedUser.userIdentity,
				key: key,
				value: value
			});

			scrollToDownloadList('auto');

			dispatchDownloadMediaContext({
				type: DOWNLOAD_DELETE_BY_KEY_VALUE,
				userIdentity: selectedUser.userIdentity,
				key: key,
				value: value
			});
		}
	};

	return (
		<div className='media-layout-threedot-button'>
			<ThreeDot
				className='media-threedot'
				onClick={e => {
					btnOpenDropDownHandler(e);
				}}></ThreeDot>
			<UploadThreeDotDropDown
				type={type}
				deleteAll={deleteAll}
				deleteByKeyValue={deleteByKeyValue}
				handleClose={handleClose}
				anchorEl={anchorEl}></UploadThreeDotDropDown>
		</div>
	);
};

export default ThreeDotButton;
