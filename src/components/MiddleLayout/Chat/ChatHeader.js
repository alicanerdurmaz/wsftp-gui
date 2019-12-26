import React, { useContext } from 'react';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { ReactComponent as AtIcon } from '../../../assets/svg/at.svg';
const ChatHeader = () => {
  const { selectedUser } = useContext(SelectUserContext);
  return (
    <div className='chat-header-container'>
      <div className='chat-header-area'>
        <ul className='user-info'>
          <li>
            <AtIcon></AtIcon>
          </li>
          <li>
            <span className='colorBlue'>{selectedUser && selectedUser.username}</span>
          </li>
        </ul>
        {/* <input type='text' className='search-message' placeholder='Search a message'></input> */}
      </div>
    </div>
  );
};

export default ChatHeader;
