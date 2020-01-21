import React, { useContext, Fragment, useRef, useEffect } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';
import useOnScreen from '../../hooks/useOnScreen';
import { GET_MSG_FROM_DB } from '../../../context/types';

const ChatOldList = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { messageFromDatabase, dispatchDbContext } = useContext(DatabaseMessageContext);
  const refOldListTop = useRef(null);
  const onScreen = useOnScreen(refOldListTop);

  useEffect(() => {
    if (!onScreen) return;
    dispatchDbContext({ type: GET_MSG_FROM_DB, userIdentity: selectedUser.userIdentity });
  }, [onScreen]);

  return (
    <Fragment>
      <span className='ref-old-list-top' ref={refOldListTop}></span>
      {messageFromDatabase[selectedUser.userIdentity]
        ? messageFromDatabase[selectedUser.userIdentity].map((message, index) => {
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
