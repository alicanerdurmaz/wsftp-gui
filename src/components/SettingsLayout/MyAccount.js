import React, { useState, useRef } from 'react';
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg';
import { writeObject } from '../../backend/api/dbFunctions';
import { API_refreshOnlineUserList, API_getMyInfo } from '../../backend/api/webSocketConnection';
const os = require('os');
const remote = require('electron').remote;

const MyAccount = ({ settings }) => {
	const [openEdit, setOpenEdit] = useState(false);
	const [newUsername, setNewUsername] = useState('');

	const handleOpenEdit = () => {
		if (openEdit) return;
		setOpenEdit(true);
	};
	const btnSaveEdit = () => {
		if (newUsername.length < 3 || newUsername.length > 24) {
			return;
		}
		const obj = { username: newUsername };
		writeObject('wsftp-settings.json', 'docu', obj);

		setOpenEdit(false);
		API_refreshOnlineUserList();
		API_getMyInfo();
	};

	const btnDefaultEdit = () => {
		setNewUsername(os.userInfo().username);
	};
	const btnCancelEdit = () => {
		setOpenEdit(false);
	};
	return (
		<div className='modal-my-account-container'>
			<div className='modal-section-title'>My Account</div>
			<div className='modal-my-account-info-container'>
				<div className='modal-my-account-info-section'>
					<div>
						<span className='modal-modal-my-account-title clickable' onClick={handleOpenEdit}>
							USERNAME
						</span>
						<span className='btn-edit' onClick={handleOpenEdit}>
							<EditIcon className='edit-icon'></EditIcon>
						</span>
					</div>
					<span className='modal-modal-my-account-text'>{settings['myInfo'] && settings['myInfo'].nick}</span>
					{openEdit ? (
						<div className='username-edit-area'>
							<input
								maxLength='24'
								type='text'
								className='username-input'
								value={newUsername}
								placeholder={`Enter new username`}
								onChange={e => setNewUsername(e.target.value)}></input>
							<div className='modal-btn-group'>
								<button className='modal-btn bg-colorGreen' onClick={btnSaveEdit}>
									Save
								</button>
								<button className='modal-btn bg-colorBlue' onClick={btnDefaultEdit}>
									Default
								</button>
								<button className='modal-btn bg-colorRed' onClick={btnCancelEdit}>
									Cancel
								</button>
							</div>
						</div>
					) : null}
				</div>
				<div className='two-text-group'>
					<div className='modal-my-account-info-section'>
						<span className='modal-modal-my-account-title'>IP ADDRESS</span>
						<span className='modal-modal-my-account-text'>
							{settings['myInfo'] && settings['myInfo'].ip}
						</span>
					</div>
					<div className='modal-my-account-info-section'>
						<span className='modal-modal-my-account-title'>Mac ADDRESS</span>
						<span className='modal-modal-my-account-text'>
							{settings['myInfo'] && settings['myInfo'].mac}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyAccount;
