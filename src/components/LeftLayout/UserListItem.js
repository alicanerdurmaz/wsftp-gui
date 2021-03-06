import React, { useContext, useRef } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { OnlineUserContext } from '../../context/OnlineUserContext/OnlineUserContext';
import { ReactComponent as DesktopIcon } from '../../assets/svg/desktop.svg';
import { ReactComponent as AngleRightIcon } from '../../assets/svg/angle-right.svg';
import { ReactComponent as VolumeMuteIcon } from '../../assets/svg/volume-mute.svg';
import { DatabaseMessageContext } from '../../context/DatabaseMessageContext/DatabaseMessageContext';
import { RESET_BY_NAME } from '../../context/types';
import UserListDropDown from './UserListDropDown';
import useDeleteMessages from '../hooks/useDeleteMessages';
const { remote } = require('electron');
const dialog = remote.dialog;

const UserListItem = ({ status, username, ip, macAddress, userIdentity, notificationNumber, muted, nick }) => {
	const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
	const { muteOrUnmute } = useContext(OnlineUserContext);
	const { dispatchDbContext } = useContext(DatabaseMessageContext);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const deleteAll = useDeleteMessages();
	const selectedRef = useRef(false);

	const selectUserHandler = e => {
		if (anchorEl || selectedRef.current) return;

		if (selectedUser) {
			const user = selectedUser.userIdentity;
			dispatchDbContext({
				type: RESET_BY_NAME,
				userIdentity: user
			});
		}
		setSelectedUser({
			status: status,
			username: username,
			ip: ip,
			macAddress: macAddress,
			userIdentity: userIdentity,
			notificationNumber: notificationNumber,
			muted: muted,
			nick: nick
		});
	};

	const contextMenuHandler = e => {
		selectedRef.current = true;
		setAnchorEl(e.currentTarget);
	};
	const btnOpenDropDownHandler = e => {
		e.preventDefault();
		e.stopPropagation();
		selectedRef.current = true;
		setAnchorEl(e.currentTarget);
	};
	const handleMute = () => {
		muteOrUnmute(userIdentity, !muted);
		handleClose();
	};
	const handleDelete = e => {
		e.preventDefault();
		e.stopPropagation();
		let options = {
			buttons: ['No', 'Yes'],
			message: `Are you sure you want to delete all messages in this chat with ${username} ?`
		};
		let response = dialog.showMessageBoxSync(remote.getCurrentWindow(), options);
		if (response) {
			deleteAll(userIdentity);
		}
		handleClose();
	};
	const handleClose = () => {
		selectedRef.current = false;
		setAnchorEl(null);
	};
	return (
		<li
			className={`user-li ${selectedRef.current ? 'selected' : ''}`}
			onClick={e => selectUserHandler(e)}
			onContextMenu={e => {
				contextMenuHandler(e);
			}}>
			<div className={`user-list-container ${status}`}>
				<DesktopIcon></DesktopIcon>
				<div className='notification-number-container'>
					{notificationNumber >= 1 ? <div className='notification-number'>{notificationNumber}</div> : null}
				</div>
				<span className='primary-text'>{nick}</span>
				<div className='user-list-rightinfo-container'>
					<AngleRightIcon
						onClick={e => {
							btnOpenDropDownHandler(e);
						}}></AngleRightIcon>
					{muted ? <VolumeMuteIcon></VolumeMuteIcon> : null}
				</div>
			</div>
			<UserListDropDown
				muted={muted}
				anchorEl={anchorEl}
				handleClose={handleClose}
				handleMute={handleMute}
				handleDelete={e => handleDelete(e)}></UserListDropDown>
		</li>
	);
};
export default UserListItem;
