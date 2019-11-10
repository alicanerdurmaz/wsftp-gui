import React, { Fragment, useState, useCallback } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';

const Chat = () => {
  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className='chat-read-container'>
        <ChatList></ChatList>
      </div>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;
