import React, { useContext, Fragment, useRef, useEffect, useState } from 'react';
import ChatOldListTextMessage from './ChatOldListTextMessage';
import ChatOldListFileMessage from './ChatOldListFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';
import { GET_MSG_FROM_DB } from '../../../context/types';
import useOnScreen from '../../hooks/useOnScreen';
import findDbDirectory from '../../../Helpers/findDbDirectory';
import { getFromDataBaseSync, getBlockFromDataBaseSync } from '../../../backend/api/dbFunctions';

const ChatOldList = ({ scrollDirection }) => {
  const { selectedUser } = useContext(SelectUserContext);
  const { messageFromDatabase, dispatchDbContext } = useContext(DatabaseMessageContext);

  const refOldListTop = useRef(false);
  const refOldListBottom = useRef(false);

  const isTopOnScreen = useOnScreen(refOldListTop);
  const isBottomOnScreen = useOnScreen(refOldListBottom);
  console.log(messageFromDatabase);
  useEffect(() => {
    if (!isTopOnScreen) return;

    if (scrollDirection.current < 0) {
      getOlderDataFromDb();
    }
  }, [isTopOnScreen]);

  useEffect(() => {
    if (scrollDirection.current > 0) {
      getNewerDataFromDb();
    }
  }, [isBottomOnScreen]);

  const getOlderDataFromDb = () => {
    const id = messageFromDatabase[selectedUser.userIdentity][0].uuid;
    const result = getBlockFromDataBaseSync(`${selectedUser.userIdentity}.json`, findDbDirectory(), 'uuid', id, 20, 20);
    if (result.lenDown < 0) return;
    if (result.lenDown === 0) {
      result.arr.push({
        content: 'No More Data',
        from: 'info',
        contentType: 'text',
        uuid: 'nomoredata'
      });
    }
    dispatchDbContext({
      type: GET_MSG_FROM_DB,
      userIdentity: selectedUser.userIdentity,
      data: result.arr.reverse()
    });
  };

  const getNewerDataFromDb = () => {
    const cursor = messageFromDatabase[selectedUser.userIdentity].length - 10;
    const id = messageFromDatabase[selectedUser.userIdentity][cursor].uuid;
    const result = getBlockFromDataBaseSync(`${selectedUser.userIdentity}.json`, findDbDirectory(), 'uuid', id, 20, 20);

    dispatchDbContext({
      type: GET_MSG_FROM_DB,
      userIdentity: selectedUser.userIdentity,
      data: result.arr.reverse()
    });
  };

  return (
    <Fragment>
      <span className='ref-old-list-top' ref={refOldListTop}></span>
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
      <span className='ref-old-list-bottom' ref={refOldListBottom}></span>
    </Fragment>
  );
};

export default ChatOldList;
