import React, { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';

import { SelectUserContext } from '../context/SelectUserContext';
import { API_SendFile } from '../backend/api/webSocketConnection';
import Spinner from './Spinner';
import uuid from 'uuid/v4';
import { SettingsContext } from '../context/SettingsContext';
import { OnlineUserContext } from '../context/OnlineUserContext/OnlineUserContext';
const DragAndDropProvider = props => {
	const { enqueueSnackbar } = useSnackbar();
	const { selectedUser } = useContext(SelectUserContext);
	const { onlineUserList } = useContext(OnlineUserContext);
	const { settings } = useContext(SettingsContext);
	const [counter, setCounter] = useState(0);
	const [showDnd, setShowDnd] = useState('');

	useEffect(() => {
		if (counter === 0 && showDnd) {
			setShowDnd('');
		}
	}, [counter]);

	const onDragEnterHandler = event => {
		event.stopPropagation();
		event.preventDefault();
		if (!selectedUser) {
			return;
		}
		setCounter(counter + 1);
		setShowDnd('showDnd');
	};
	const onDragLeaveHandler = event => {
		event.stopPropagation();
		event.preventDefault();
		setCounter(counter - 1);
	};

	const onDragOverHandler = event => {
		event.stopPropagation();
		event.preventDefault();
		return false;
	};
	const onFileDropHandler = async event => {
		event.stopPropagation();
		event.preventDefault();

		if (!selectedUser || onlineUserList[selectedUser.userIdentity].event === 'offline') {
			enqueueSnackbar(`${selectedUser.username} is offline`, { variant: 'error' });
			setCounter(0);
			return;
		}

		const data = await event.dataTransfer.files;
		for (let i = 0; i < data.length; i++) {
			if (data[i].type === '') {
				enqueueSnackbar(`no support for folder transaction`, { variant: 'error' });
				setCounter(0);
				return;
			}
		}

		const fileDirArray = Object.values(data).map(e => e.path);
		const idArray = fileDirArray.map(e => uuid());

		API_SendFile(
			selectedUser.macAddress,
			fileDirArray,
			idArray,
			selectedUser.ip,
			selectedUser.username,
			selectedUser.nick
		);

		setCounter(0);
	};

	return (
		<div
			className={'main-container'}
			onDragEnter={event => onDragEnterHandler(event)}
			onDragLeave={event => onDragLeaveHandler(event)}
			onDragOver={event => onDragOverHandler(event)}
			onDrop={event => onFileDropHandler(event)}>
			<div className={`area-hidden ${showDnd}`}></div>
			{props.children}
		</div>
	);
};

export default DragAndDropProvider;
