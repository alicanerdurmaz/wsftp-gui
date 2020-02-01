import React, { useState, useContext, Fragment, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ReactComponent as FileUploadIcon } from '../../../assets/svg/file-upload.svg';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { API_SendMessage, API_SendFile } from '../../../backend/api/webSocketConnection';
import uuid from 'uuid/v4';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';

const { dialog } = window.require('electron').remote;

const ChatInput = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { onlineUserList } = useContext(OnlineUserContext);
	const [text, setText] = useState('');
	const root = useRef(document.documentElement);

	const handleHeightChange = e => {
		const newPx = e + 31;
		root.current.style.setProperty('--input-px', newPx + 'px');
	};
	const handleKeyEvents = e => {
		if (e.key === 'Enter' && e.shiftKey) {
			return true;
		} else if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const sendMessage = e => {
		if (text.length < 1) {
			return;
		}
		API_SendMessage(selectedUser.macAddress, text, selectedUser.ip, selectedUser.username, selectedUser.nick);
		setText('');
	};

	const openFileExplorer = async () => {
		if (!selectedUser) {
			return false;
		}
		const result = await dialog.showOpenDialog({ properties: ['multiSelections'] });
		const idArray = result.filePaths.map(e => uuid());

		API_SendFile(
			selectedUser.macAddress,
			result.filePaths,
			idArray,
			selectedUser.ip,
			selectedUser.username,
			selectedUser.nick
		);
	};

	return (
		<div className='chat-input-area'>
			{onlineUserList[selectedUser.userIdentity].event === 'online' ? (
				<Fragment>
					<FileUploadIcon onClick={() => openFileExplorer()}></FileUploadIcon>
					<TextareaAutosize
						minRows={1}
						maxRows={4}
						value={text}
						onHeightChange={e => handleHeightChange(e)}
						placeholder='Type a message'
						className='text-area-autosize'
						onChange={e => setText(e.target.value)}
						onKeyDown={e => handleKeyEvents(e)}></TextareaAutosize>
				</Fragment>
			) : null}
		</div>
	);
};

export default ChatInput;
