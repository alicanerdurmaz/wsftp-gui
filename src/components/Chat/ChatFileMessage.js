import React, { useState, Fragment } from 'react';

const ChatFileMessage = ({ accepted, from, createdAt, fileType, fileSize, fileName, dir }) => {
  if (from !== '*MYPC*') {
    from = 'other';
  }
  const setAccepted = action => {
    console.log(action);
  };

  console.log(accepted);
  console.log(from);
  console.log(createdAt);
  console.log(fileType);
  console.log(fileSize);
  console.log(fileName);
  console.log(dir);
  return (
    <Fragment>
      <li className={`file-message-container ${from}`}>
        <div className={`file-message-content ${from}`}>
          <i className={`fas fa-file-pdf file-icon`}></i>
          <div className='file-info'>
            <span className='file-name'>{fileName}</span>
            <span className='file-size'>{fileSize}</span>
          </div>
          {!accepted && from === 'other' ? (
            <div className='btn-group'>
              <i className='fas fa-check-circle colorGreen ' onClick={() => setAccepted(true)}></i>
              <i className='fas fa-ban colorRed' onClick={() => setAccepted(false)}></i>
            </div>
          ) : (
            <div className='btn-group'>
              <i className='fas fa-check colorGreen'></i>
              {/* <i className='fas fa-times colorRed'></i> */}
            </div>
          )}
        </div>
      </li>
      <span className={`file-message-createdAt ${from}`}>
        <span className='createdAt-f'>{createdAt}</span>
      </span>
    </Fragment>
  );
};

export default ChatFileMessage;
