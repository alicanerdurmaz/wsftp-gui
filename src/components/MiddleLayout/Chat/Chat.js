import React, { Fragment, useState, useRef, useEffect, useContext, useLayoutEffect } from 'react';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import { getFromDataBase } from '../../../backend/api/dbFunctions';
import ChatOldList from '../Chat/ChatOldList';
import { SelectUserContext } from '../../../context/SelectUserContext';

const Chat = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const [oldList, setOldList] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [hidden, setHidden] = useState('hidden');
  const [getFromDbRange, setGetFromDbRange] = useState({ start: 0, end: 20 });
  let refScroller = useRef(false);
  const scrollHeightBeforeLoad = useRef(false);
  const loadingState = useRef(false);

  useEffect(() => {
    setGetFromDbRange({ start: 0, end: 20 });
    setOldList([]);
    fetchData();
  }, [selectedUser]);

  useEffect(() => {
    refScroller.scrollTop = refScroller.scrollHeight - scrollHeightBeforeLoad.current;
    loadingState.current = false;
  }, [oldList]);

  console.log(selectedUser, getFromDbRange.start, getFromDbRange.end, setOldList.length);

  const handleScroll = e => {
    const limit = refScroller.scrollHeight - refScroller.scrollTop - 250;
    if (limit < refScroller.clientHeight) {
      setShouldScroll(true);
      setHidden('hidden');
    } else if (limit > refScroller.clientHeight) {
      setShouldScroll(false);
      setHidden('');
    }
    if (!loadingState.current && refScroller.scrollTop === 0) {
      loadingState.current = true;
      fetchData();
    }
  };
  const jumpToBottom = () => {
    refScroller.scrollTop = refScroller.scrollHeight;
  };

  const fetchData = () => {
    if (!selectedUser) {
      return false;
    }

    scrollHeightBeforeLoad.current = refScroller.scrollHeight;
    getFromDataBase(
      `${selectedUser.userIdentity}.json`,
      './src/database/',
      getFromDbRange.start,
      getFromDbRange.end,
      (err, arr, len) => {
        if (len === -1) {
          console.log('history bitti');
          return;
        }
        arr.reverse();
        setGetFromDbRange(getFromDataBase => ({ start: getFromDbRange.end, end: getFromDbRange.end + 20 }));
        setOldList(oldList => arr.concat(oldList));
      }
    );
  };

  return (
    <Fragment>
      <ChatHeader></ChatHeader>
      <div className={`chat-read-container`} onScroll={e => handleScroll(e)} ref={e => (refScroller = e)}>
        <ul className='chat-list'>
          {selectedUser ? (
            <Fragment>
              <ChatOldList oldList={oldList}> </ChatOldList>
              <ChatList shouldScroll={shouldScroll}></ChatList>
            </Fragment>
          ) : null}
        </ul>
      </div>
      <button className={`btn-jumpToPresent ${hidden}`} onClick={jumpToBottom}>
        <span>Jump to Present</span>
      </button>
      <div className='chat-input-container'>
        <ChatInput></ChatInput>
      </div>
    </Fragment>
  );
};

export default Chat;
