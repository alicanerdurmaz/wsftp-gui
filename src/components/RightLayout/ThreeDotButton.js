import React, { useState, useContext } from 'react';
import { ReactComponent as ThreeDot } from '../../assets/svg/ellipsis-v-solid.svg';
import UploadThreeDotDropDown from './ThreeDotDropDown';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import {
	UPLOAD_MEDIA_DELETE_DB,
	UPLOAD_MEDIA_USER_DELETED,
	UPLOAD_DELETE_BY_KEY_VALUE,
	OLD_UPLOAD_DELETE_BY_KEY_VALUE
} from '../../context/types';
import findDbDirectory from '../../Helpers/findDbDirectory';
import { deleteDataBaseSync, deleteFromDataBase } from '../../backend/api/dbFunctions';
const ThreeDotButton = ({ scrollToUploadList, type }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { selectedUser } = useContext(SelectUserContext);
	const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);

	const btnOpenDropDownHandler = e => {
		e.preventDefault();
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteAll = () => {
		dispatchUploadMediaContext({
			type: UPLOAD_MEDIA_USER_DELETED,
			userIdentity: selectedUser.userIdentity
		});
		dispatchOldUploadMediaContext({
			type: UPLOAD_MEDIA_DELETE_DB,
			userIdentity: selectedUser.userIdentity
		});
		deleteDataBaseSync(`media:upload:${selectedUser.userIdentity}.json`, findDbDirectory());
	};

	const deleteByKeyValue = (key, value) => {
		setAnchorEl(null);
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
