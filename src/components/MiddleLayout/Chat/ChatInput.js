import React, { useState, useContext, Fragment, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ReactComponent as FileUploadIcon } from '../../../assets/svg/file-upload.svg';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { API_SendMessage, API_SendFile } from '../../../backend/api/webSocketConnection';
import uuid from 'uuid/v4';

const { dialog } = window.require('electron').remote;

const ChatInput = () => {
  const { selectedUser } = useContext(SelectUserContext);

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
    API_SendMessage(selectedUser.macAddress, text);
    setText('');
  };

  const openFileExplorer = async () => {
    if (!selectedUser) {
      return false;
    }
    const result = await dialog.showOpenDialog({ properties: ['multiSelections'] });
    const macAddress = selectedUser.macAddress;
    const uuidTemp = uuid();
    result.filePaths.forEach(path => {
      API_SendFile(macAddress, path, uuidTemp);
    });
  };
  return (
    <div className='chat-input-area'>
      {selectedUser && selectedUser.status === 'online' ? (
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
