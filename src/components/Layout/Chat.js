import React, { Fragment, useState, useRef, useEffect } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import { getFromDataBase } from '../../backend/api/dbFunctions';

const Chat = () => {
  const [oldList, setOldList] = useState([]);

  let refScroller = useRef(false);
  const scrollHeightBeforeLoad = useRef(false);
  const listStart = useRef(180);
  const listEnd = useRef(200);
  const loadingState = useRef(false);

  useEffect(() => {
    refScroller.scrollTop = refScroller.scrollHeight - scrollHeightBeforeLoad.current;
    loadingState.current = false;
  }, [oldList]);

  const handleScroll = e => {
    if (!loadingState.current && refScroller.scrollTop === 0) {
      loadingState.current = true;
      fetchData();
    }
  };

  const fetchData = () => {
    scrollHeightBeforeLoad.current = refScroller.scrollHeight;
    getFromDataBase('test.json', 'desk', listStart.current, listEnd.current, (err, arr, len) => {
      if (len === -1) {
        console.log('history bitti');
        return;
      }
      listEnd.current = listStart.current;
      listStart.current -= 20;
      setOldList(oldList => [...arr, ...oldList]);
    });
  };
  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className={`chat-read-container`} onScroll={e => handleScroll(e)} ref={e => (refScroller = e)}>
        <ul className='chat-list'>
          <li className='message-container'>
            <button onClick={fetchData}>Load More</button>
          </li>
          <ChatList oldList={oldList}></ChatList>
        </ul>
      </div>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;
