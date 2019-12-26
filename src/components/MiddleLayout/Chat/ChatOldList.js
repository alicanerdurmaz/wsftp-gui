import React, { useContext, useEffect, useRef } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';

export const ChatOldList = ({ oldList }) => {
  const { selectedUser } = useContext(SelectUserContext);

  let messagesEnd = useRef(null);

  // scroll to lasted message
  useEffect(() => {
    scrollToBottom();
  }, []);
  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <div>
      {oldList &&
        oldList.map(message => {
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
                port={message.port}
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
        })}
      <div
        ref={el => {
          messagesEnd = el;
        }}></div>
    </div>
  );
};

export default ChatOldList;
