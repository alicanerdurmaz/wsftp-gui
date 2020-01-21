import React, { Fragment, useState, useRef, useEffect, useContext } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import ChatOldList from '../Chat/ChatOldList';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';

import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';

const Chat = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { resetNotificationNumber, incrementNotificationNumber } = useContext(OnlineUserContext);
  const { messageFromDatabase, dispatchDbContext } = useContext(DatabaseMessageContext);
  const { messageHistory, lastIncomingMessage } = useContext(MessageContext);

  const [hidden, setHidden] = useState('hidden');
  let refScroller = useRef(false);
  console.log(hidden);
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
    selectedUser && resetNotificationNumber(selectedUser.userIdentity);
  }, [selectedUser]);

  const jumpToBottom = type => {
    selectedUser && resetNotificationNumber(selectedUser.userIdentity);
    refScroller.scrollTo({
      top: refScroller.scrollHeight,
      left: 0,
      behavior: type
    });
  };

  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className={`chat-read-container`} ref={e => (refScroller = e)}>
        <ul className='chat-list'>
          {selectedUser ? (
            <Fragment>
              <ChatOldList></ChatOldList>
              <ChatList setHidden={setHidden} jumpToBottom={jumpToBottom}></ChatList>
            </Fragment>
          ) : (
            <div className='no-selected-user-info'>Select user from left.</div>
          )}
        </ul>
      </div>
      <button className={`btn-jumpToPresent ${hidden}`} onClick={e => jumpToBottom('auto')}>
        <span>Jump to Present</span>
      </button>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;

// DOMRect {x: 162, y: -28, width: 530, height: 18, top: -28, …}
// bottom: -10
// height: 18
// left: 162
// right: 692
// top: -28
// width: 530
// x: 162
// y: -28
