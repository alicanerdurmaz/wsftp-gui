import React, { useState, useContext } from 'react';

import { ReactComponent as FileUploadIcon } from '../../assets/svg/file-upload.svg';
import { SelectUserContext } from '../../context/SelectUserContext';
import { commanderSocket } from '../../backend/api/webSocketConnection';
import { API_SendMessage, API_SendFile } from '../../backend/api/apiFunctions';

const { dialog } = window.require('electron').remote;

const ChatInput = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const [text, setText] = useState('');

  const sendMessage = e => {
    if (selectedUser === null) {
      return;
    } else if (text.length < 1) {
      return;
    } else if (e.key === 'Enter') {
      API_SendMessage(selectedUser.macAddress, text);

      setText('');
    } else {
      return false;
    }
  };
  const checkEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return false;
    }
  };

  const openFileExplorer = async () => {
    if (!selectedUser) {
      return false;
    }
    const result = await dialog.showOpenDialog({ properties: ['multiSelections'] });
    const macAddress = selectedUser.macAddress;
    result.filePaths.map(path => {
      API_SendFile(macAddress, path);
      return true;
    });
  };
  return (
    <div className='chat-input-area'>
      <div className='file-upload-container' onClick={() => openFileExplorer()}>
        <FileUploadIcon></FileUploadIcon>
      </div>
      <textarea
        value={text}
        placeholder='Type a message'
        className='text-area-autosize'
        onChange={e => setText(e.target.value)}
        onKeyUp={sendMessage}
        onKeyDown={checkEnter}></textarea>
    </div>
  );
};

export default ChatInput;
