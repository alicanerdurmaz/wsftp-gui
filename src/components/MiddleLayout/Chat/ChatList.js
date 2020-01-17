import React, { useRef, useEffect, useContext, Fragment, useState, useLayoutEffect } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { MessageContext } from '../../../context/MessageContext/MessageContext';

const ChatList = ({ shouldScroll }) => {
  const { selectedUser } = useContext(SelectUserContext);
  const { messageHistory } = useContext(MessageContext);

  return (
    <Fragment>
      {messageHistory[selectedUser.userIdentity]
        ? messageHistory[selectedUser.userIdentity].map(message => {
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
          })
        : null}
    </Fragment>
  );
};

export default ChatList;