import React, { Fragment, useState, useRef } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import ChatListOld from './ChatListOld';

const Chat = () => {
  const chatContainerRef = useRef(null);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const limit = (chatContainerRef.current.scrollHeight * 20) / 100;
    if (limit > chatContainerRef.current.scrollTop) {
      console.log('fetch data');
    }
  };

  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className='chat-read-container' onScroll={handleScroll} ref={chatContainerRef}>
        <ul className='chat-list'>
          <ChatListOld selectedUser={null}></ChatListOld>
          <ChatList></ChatList>
        </ul>
      </div>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;
