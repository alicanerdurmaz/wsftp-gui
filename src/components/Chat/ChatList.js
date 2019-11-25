import React, { useRef, useEffect, useContext, useState } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../context/SelectUserContext';
import { MessageContext } from '../../context/MessageContext/MessageContext';

const ChatList = () => {
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const { messageHistory } = useContext(MessageContext);
  console.log(messageHistory);
  // scroll to lasted message
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);
  let messagesEnd = useRef(null);
  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'auto' });
  };
  return (
    <ul className='chat-list'>
      {selectedUser &&
        messageHistory[selectedUser.username].map(message => {
          if (message.contentType === 'text') {
            return (
              <ChatTextMessage
                key={message.uuid}
                content={message.content}
                createdAt={message.createdAt}
                sender={message.from}></ChatTextMessage>
            );
          } else if (message.contentType === 'file') {
            return (
              <ChatFileMessage
                key={message.uuid}
                accepted={message.accepted}
                from={message.username}
                dbName={message.dbName}
                createdAt={message.createdAt}
                fileType={message.fileType}
                fileSize={message.fileSize}
                fileName={message.fileName}
                dir={message.dir}
                ip={message.ip}
                uuid={message.uuid}></ChatFileMessage>
            );
          } else {
            return null;
          }
        })}
      <div
        ref={el => {
          messagesEnd = el;
        }}></div>
    </ul>
  );
};

export default ChatList;
