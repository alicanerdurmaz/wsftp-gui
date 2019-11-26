import React, { useContext, Fragment } from 'react';
import { commanderSocket } from '../../backend/api/api';
import { MessageContext } from '../../context/MessageContext/MessageContext';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { STATUS_CHANGED } from '../../context/types';
const ChatFileMessage = ({ fileStatus, from, createdAt, fileType, fileSize, fileName, dir, ip, uuid, dbName }) => {
  const { dispatch } = useContext(MessageContext);
  let tempFrom = '';
  if (from !== '*MYPC*') {
    tempFrom = 'other';
  }

  const setAccepted = action => {
    if (action) {
      const tempAcceptRequest = {
        stat: 'cacp',
        ip: ip,
        dir: dir,
        dest: '/home/alican/Desktop'
      };
      commanderSocket.send(JSON.stringify(tempAcceptRequest));
      dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.accepted } });
    }
    if (!action) {
      const tempRejectRequest = {
        stat: 'crej',
        ip: ip,
        dir: dir
      };
      commanderSocket.send(JSON.stringify(tempRejectRequest));
      dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected } });
    }
  };

  return (
    <Fragment>
      <li className={`file-message-container ${tempFrom}`}>
        <div className={`file-message-content ${tempFrom}`}>
          <i className={`fas fa-file-pdf file-icon`}></i>
          <div className='file-info'>
            <span className='file-name'>{fileName}</span>
            <span className='file-size'>{fileSize}</span>
          </div>
          {fileStatus === FILE_STATUS.waiting && tempFrom === 'other' ? (
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
      <span className={`file-message-createdAt ${tempFrom}`}>
        <span className='createdAt-f'>{createdAt}</span>
      </span>
    </Fragment>
  );
};

export default ChatFileMessage;
