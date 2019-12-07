import React, { useContext, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import { commanderSocket } from '../../backend/api/webSocketConnection';
import { MessageContext } from '../../context/MessageContext/MessageContext';
import { STATUS_CHANGED } from '../../context/types';
import { byteConverter } from '../../Helpers/byteConverter';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
import { ReactComponent as FileIcon } from '../../assets/svg/file-solid.svg';
import { ReactComponent as BanIcon } from '../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/check-circle-solid.svg';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';

const useStyles = makeStyles(theme => ({
  circularProgress: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  linearProgress: {
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

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
  mac
}) => {
  const classes = useStyles();

  const { dispatch } = useContext(MessageContext);
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
        dest: '/home/alican/Desktop',
        id: uuid
      };
      console.log(tempAcceptRequest);
      commanderSocket.send(JSON.stringify(tempAcceptRequest));
      dispatch({ type: STATUS_CHANGED, payload: { uuid: uuid, dbName: dbName, fileStatus: FILE_STATUS.loading } });
    }
    if (!action) {
      const tempRejectRequest = {
        event: 'crej',
        mac: mac,
        dir: dir
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
    } else if (fileStatus === FILE_STATUS.rejected) {
      return (
        <div className='btn-group'>
          <TimesIcon className='times-icon disabled'></TimesIcon>
        </div>
      );
    } else if (fileStatus === FILE_STATUS.loading) {
      return (
        <div className={classes.circularProgress}>
          <CircularProgress />
        </div>
      );
    } else if (fileStatus === FILE_STATUS.sent) {
      return <CheckIcon className='check-icon' onClick={() => setAccepted(true)}></CheckIcon>;
    }
  };

  return (
    <Fragment>
      <li className={`file-message-container ${tempFrom}`}>
        <div className={`file-message-content ${tempFrom}`}>
          <FileIcon className='file-icon'></FileIcon>
          <div className='file-info'>
            <span className='file-name'>{fileName}</span>
            <span className='file-size'>{formattedFileSize}</span>
          </div>
          {fileInformation()}
        </div>
      </li>

      {fileStatus === FILE_STATUS.loading ? (
        <div className={`${classes.linearProgress} custom-progressbar-container-${tempFrom}`}>
          <LinearProgress variant='determinate' value={progress} className={`custom-progressbar-props-${tempFrom}`} />
        </div>
      ) : null}

      <span className={`file-message-createdAt ${tempFrom}`}>
        <span className='createdAt-f'>{createdAt}</span>
      </span>
    </Fragment>
  );
};

export default ChatFileMessage;
