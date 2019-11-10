import React, { useContext } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';

const ChatHeader = () => {
  const { selectedUser } = useContext(SelectUserContext);
  return (
    <div className='chat-header-container'>
      <div className='chat-header-area'>
        <ul className='user-info'>
          <li>
            <i className='fas fa-at'></i>
          </li>
          <li>
            <span className='colorBlue'>{selectedUser && selectedUser.username}</span>
          </li>
        </ul>
        <input type='text' className='search-message' placeholder='Search a message'></input>
      </div>
    </div>
  );
};

export default ChatHeader;
