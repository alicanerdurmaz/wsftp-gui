import React, { useContext, useState } from 'react';

import UserListItem from './UserListItem';
import { OnlineUserContext } from '../../context/OnlineUserContext/OnlineUserContext';

const UserListContainer = () => {
  const { onlineUserList } = useContext(OnlineUserContext);
  const [filter, setFilter] = useState('');

  return (
    <div>
      <ul className='user-ul'>
        <li className='user-li nohighlight'>
          <input
            type='text'
            className='search-user'
            placeholder='Search a user'
            value={filter}
            onChange={e => setFilter(e.currentTarget.value)}></input>
        </li>
        {Object.keys(onlineUserList).map(index => {
          if (!onlineUserList[index].username.toLowerCase().startsWith(filter.toLowerCase())) {
            return false;
          }
          return onlineUserList[index].event === 'online' ? (
            <UserListItem
              status={onlineUserList[index].event}
              username={onlineUserList[index].username}
              ipAddress={onlineUserList[index].ip}
              macAddress={onlineUserList[index].mac}
              userIdentity={onlineUserList[index].userIdentity}
              notificationNumber={onlineUserList[index].notificationNumber}
              key={index}></UserListItem>
          ) : null;
        })}
        {Object.keys(onlineUserList).map(index => {
          if (!onlineUserList[index].username.toLowerCase().startsWith(filter.toLowerCase())) {
            return false;
          }
          return onlineUserList[index].event === 'offline' ? (
            <UserListItem
              status={onlineUserList[index].event}
              username={onlineUserList[index].username}
              ipAddress={onlineUserList[index].ip}
              macAddress={onlineUserList[index].mac}
              userIdentity={onlineUserList[index].userIdentity}
              notificationNumber={onlineUserList[index].notificationNumber}
              key={index}></UserListItem>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default UserListContainer;
