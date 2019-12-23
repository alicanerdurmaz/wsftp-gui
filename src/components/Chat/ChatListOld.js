import React, { Fragment, useRef, useState, useEffect } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import fakeData from '../../database/virtualmint:08:00:27:fc:3d:f2.json';

import { getFromDataBase } from '../../backend/api/dbFunctions';

const ChatListOld = ({ selectedUser }) => {
  let scrollerRef = useRef(null);
  const [oldList, setOldList] = useState([]);
  const listStart = useRef(0);
  const listEnd = useRef(20);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    console.log('fetchData');
    getFromDataBase('test.json', 'desk', listStart.current, listEnd.current, (err, arr, len) => {
      listStart.current = listEnd.current;
      listEnd.current += 20;
      setOldList(...oldList, arr);
    });
  };
  console.log(oldList.length, listStart.current, listEnd.current);
  return (
    <>
      {oldList.map((message, index) => {
        return (
          <ChatTextMessage
            key={index}
            content={message.content}
            createdAt={message.createdAt}
            sender={message.from}></ChatTextMessage>
        );
      })}
    </>
  );
};

export default ChatListOld;
