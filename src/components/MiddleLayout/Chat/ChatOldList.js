import React, { useContext, Fragment, useRef, useEffect } from 'react';
import ChatOldListTextMessage from './ChatOldListTextMessage';
import ChatOldListFileMessage from './ChatOldListFileMessage';
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
      <span className='ref-old-list-top' ref={refOldListTop}>
        no more data
      </span>
      {messageFromDatabase[selectedUser.userIdentity]
        ? messageFromDatabase[selectedUser.userIdentity].map(message => {
            if (message.contentType === 'text') {
              return (
                <ChatOldListTextMessage
                  key={message.uuid}
                  content={message.content}
                  createdAt={message.createdAt}
                  sender={message.from}></ChatOldListTextMessage>
              );
            } else if (message.contentType === 'file') {
              return (
                <ChatOldListFileMessage
                  key={message.uuid}
                  fileStatus={message.fileStatus}
                  from={message.from}
                  createdAt={message.createdAt}
                  fileSize={message.fileSize}
                  fileName={message.fileName}
                  uuid={message.uuid}></ChatOldListFileMessage>
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
