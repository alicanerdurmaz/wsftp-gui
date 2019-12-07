import React, { useRef, useEffect, useContext } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../context/SelectUserContext';
import { MessageContext } from '../../context/MessageContext/MessageContext';

const ChatList = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { messageHistory } = useContext(MessageContext);
  let messagesEnd = useRef(null);

  // scroll to lasted message
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, selectedUser]);

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'auto' });
  };
  return (
    <ul className='chat-list'>
      {selectedUser ? (
        messageHistory[selectedUser.macAddress].map(message => {
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
                progress={message.progress}
                key={message.uuid}
                mac={message.mac}
                fileStatus={message.fileStatus}
                from={message.from}
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
        })
      ) : (
        <div className='no-selected-user-info'>Select user from left.</div>
      )}
      <div
        ref={el => {
          messagesEnd = el;
        }}></div>
    </ul>
  );
};

export default ChatList;
