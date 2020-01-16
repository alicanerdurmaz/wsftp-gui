import React, { Fragment, useState, useRef, useEffect, useContext } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import { getFromDataBase } from '../../../backend/api/dbFunctions';
import ChatOldList from '../Chat/ChatOldList';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';
import { GET_MSG_FROM_DB } from '../../../context/types';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';

const Chat = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { resetNotificationNumber, incrementNotificationNumber } = useContext(OnlineUserContext);
  const { messageFromDatabase, dispatch } = useContext(DatabaseMessageContext);
  const { messageHistory, lastIncomingMessage } = useContext(MessageContext);

  const [shouldScroll, setShouldScroll] = useState(true);
  const [hidden, setHidden] = useState('hidden');

  let refScroller = useRef(false);
  let scrollGoingUp = useRef(false);
  const scrollHeightBeforeLoad = useRef(false);

  useEffect(() => {
    scrollGoingUp.current = false;
    refScroller.scrollTop = refScroller.scrollHeight - refScroller.clientHeight;
    selectedUser && resetNotificationNumber(selectedUser.userIdentity);
  }, [selectedUser]);

  useEffect(() => {
    if (shouldScroll) {
      jumpToBottom();
    }
    incrementNotificationNumber(lastIncomingMessage.current);
  }, [messageHistory]);

  useEffect(() => {
    if (scrollGoingUp.current) {
      refScroller.scrollTop = refScroller.scrollHeight - scrollHeightBeforeLoad.current;
    }
  }, [messageFromDatabase]);

  const handleScroll = e => {
    const limit = refScroller.scrollHeight - refScroller.scrollTop - 125;
    if (limit < refScroller.clientHeight) {
      setShouldScroll(true);
      setHidden('hidden');
    } else if (limit > refScroller.clientHeight) {
      setShouldScroll(false);
      setHidden('');
    }
    if (refScroller.scrollTop === 0) {
      scrollHeightBeforeLoad.current = refScroller.scrollHeight;
      if (selectedUser) {
        dispatch({ type: GET_MSG_FROM_DB, userIdentity: selectedUser.userIdentity });
      }
    }
  };
  const jumpToBottom = () => {
    refScroller.scrollTop = refScroller.scrollHeight;
    setTimeout(() => {
      selectedUser && resetNotificationNumber(selectedUser.userIdentity);
    }, 50);
  };

  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div
        className={`chat-read-container`}
        onScroll={e => handleScroll(e)}
        ref={e => (refScroller = e)}
        onWheel={event => {
          if (event.nativeEvent.wheelDelta > 0) {
            scrollGoingUp.current = true;
          } else {
            scrollGoingUp.current = false;
          }
        }}>
        <ul className='chat-list'>
          {selectedUser ? (
            <Fragment>
              <ChatOldList> </ChatOldList>
              <ChatList shouldScroll={shouldScroll}></ChatList>
            </Fragment>
          ) : (
            <div className='no-selected-user-info'>Select user from left.</div>
          )}
        </ul>
      </div>
      <button className={`btn-jumpToPresent ${hidden}`} onClick={jumpToBottom}>
        <span>Jump to Present</span>
      </button>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;
