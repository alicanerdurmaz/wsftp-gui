import React, { useContext, Fragment, useState } from 'react';

import FILE_STATUS from '../../../config/CONFIG_FILE_STATUS';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { STATUS_CHANGED } from '../../../context/types';
import { byteConverter } from '../../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../../assets/svg/file-solid.svg';
import { ReactComponent as BanIcon } from '../../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/check-circle-solid.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import { API_killTransaction, commanderSocket } from '../../../backend/api/webSocketConnection';

const ChatFileMessage = ({
  fileStatus,
  from,
  createdAt,
  fileType,
  fileSize,
  fileName,
  dir,
  ip,
  uuid,
  dbName,
  progress,
  mac,
  port
}) => {
  const { dispatch } = useContext(MessageContext);
  const [showCancel, setShowCancel] = useState(false);

  let tempFrom = 'user';
  if (from !== '*MYPC*') {
    tempFrom = 'other';
  }
  const formattedFileSize = byteConverter(fileSize);

  const setAccepted = action => {
    if (action) {
      const tempAcceptRequest = {
        event: 'cacp',
        mac: mac,
        dir: dir,
        dest: 'desk',
        uuid: uuid
      };
      console.log(tempAcceptRequest);
      commanderSocket.send(JSON.stringify(tempAcceptRequest));
      dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading } });
    }
    if (!action) {
      const tempRejectRequest = {
        event: 'crej',
        mac: mac,
        dir: dir,
        uuid: uuid
      };
      commanderSocket.send(JSON.stringify(tempRejectRequest));
      dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.rejected } });
    }
  };
  const fileInformation = () => {
    if (fileStatus === FILE_STATUS.waiting) {
      return (
        <div className='btn-group'>
          <CheckIcon className='check-icon' onClick={() => setAccepted(true)}></CheckIcon>
          <BanIcon className='ban-icon' onClick={() => setAccepted(false)}>
            >
          </BanIcon>
        </div>
      );
    }
    if (fileStatus === FILE_STATUS.rejected) {
      return (
        <div className='btn-group'>
          <TimesIcon className='times-icon disabled'></TimesIcon>
        </div>
      );
    }
    if (fileStatus === FILE_STATUS.loading && !showCancel) {
      return (
        <div className='progress-text-container'>
          <span className='progress-text'>%{progress}</span>
        </div>
      );
    }
    if (fileStatus === FILE_STATUS.loading && showCancel) {
      return <TimesIcon className='times-icon-cancelprg' onClick={e => API_killTransaction(port)}></TimesIcon>;
    }
    if (fileStatus === FILE_STATUS.sent) {
      return <CheckIcon className='check-icon'></CheckIcon>;
    }
  };

  return (
    <Fragment>
      <li
        className={`file-message-container ${tempFrom}`}
        onMouseEnter={tempFrom === 'other' ? e => setShowCancel(true) : null}
        onMouseLeave={tempFrom === 'other' ? e => setShowCancel(false) : null}>
        <div
          className={`file-message-content ${tempFrom}`}
          style={{
            background:
              fileStatus === FILE_STATUS.loading ? `linear-gradient(90deg, #6ab8959c ${progress}%, #2f3136 1%)` : null
          }}>
          <FileIcon className='file-icon'></FileIcon>
          <div className='file-info'>
            <span className='file-name'>{fileName}</span>
            <span className='file-size'>{formattedFileSize}</span>
          </div>
          {fileInformation()}
        </div>
      </li>

      <span className={`file-message-createdAt ${tempFrom}`}>
        <span className='createdAt-f'>{createdAt}</span>
      </span>
    </Fragment>
  );
};

export default ChatFileMessage;
