import React, { useContext, Fragment } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';

export const ChatOldList = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { messageFromDatabase } = useContext(DatabaseMessageContext);

  return (
    <Fragment>
      {messageFromDatabase[selectedUser.userIdentity]
        ? messageFromDatabase[selectedUser.userIdentity].map(message => {
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

export default ChatOldList;
