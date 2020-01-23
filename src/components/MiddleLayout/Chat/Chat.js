import React, { Fragment, useState, useRef, useEffect, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import ChatOldList from '../Chat/ChatOldList';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';

import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';
import { RESET_BY_NAME } from '../../../context/types';

const Chat = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { onlineUserList } = useContext(OnlineUserContext);
  const { resetNotificationNumber, incrementNotificationNumber } = useContext(OnlineUserContext);
  const { dispatchDbContext } = useContext(DatabaseMessageContext);
  const { messageHistory, lastIncomingMessage } = useContext(MessageContext);

  const [hidden, setHidden] = useState('hidden');
  let refScroller = useRef(false);

  const [snackbarOptions, setsnackbarOptions] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'left',
    message: ''
  });
  const { vertical, horizontal, open, message } = snackbarOptions;

  useEffect(() => {
    if (selectedUser && selectedUser.userIdentity === lastIncomingMessage.current) {
      if (hidden === 'hidden') {
        return;
      }
    }
    incrementNotificationNumber(lastIncomingMessage);
  }, [messageHistory]);

  useEffect(() => {
    jumpToBottom('auto');
  }, [selectedUser]);

  const jumpToBottom = type => {
    if (!selectedUser) return;

    let tempNotificationNumber = onlineUserList[selectedUser.userIdentity].notificationNumber;
    let offSet = tempNotificationNumber * 76;

    if (tempNotificationNumber > 7) openSnackbar(`${tempNotificationNumber} Unread Message`);

    refScroller.scrollTo({
      top: refScroller.scrollHeight - offSet,
      left: 0,
      behavior: type
    });

    dispatchDbContext({
      type: RESET_BY_NAME,
      userIdentity: selectedUser.userIdentity
    });
    resetNotificationNumber(selectedUser.userIdentity);
  };

  const openSnackbar = msg => {
    setsnackbarOptions({ ...snackbarOptions, open: true, message: msg });
  };
  const closeSnackbar = () => {
    setsnackbarOptions({ ...snackbarOptions, open: false });
  };

  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className={`chat-read-container`} ref={e => (refScroller = e)}>
        <ul className='chat-list'>
          <Fragment>
            <ChatOldList></ChatOldList>
            <ChatList setHidden={setHidden} jumpToBottom={jumpToBottom}></ChatList>
          </Fragment>
        </ul>
      </div>
      <button className={`btn-jumpToPresent ${hidden}`} onClick={e => jumpToBottom('auto')}>
        <span>Jump to Present</span>
      </button>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
      <Snackbar
        style={{ top: '43px', left: '172px' }}
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={closeSnackbar}
        message={message}
        autoHideDuration={5000}
      />
    </Fragment>
  );
};

export default Chat;
