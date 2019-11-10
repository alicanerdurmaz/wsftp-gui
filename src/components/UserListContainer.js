import React, { useContext, useState } from 'react';

import UserListItem from './UserListItem';
import { OnlineUserContext } from '../context/OnlineUserContext/OnlineUserContext';

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
          // if (!onlineUserList[index].user.toLowerCase().startsWith(filter.toLowerCase())) {
          //   return false;
          // }
          return onlineUserList[index].stat === 'online' ? (
            <UserListItem
              status={onlineUserList[index].stat}
              username={onlineUserList[index].username}
              ipAddress={onlineUserList[index].ip}
              key={index}></UserListItem>
          ) : null;
        })}
        {Object.keys(onlineUserList).map(index => {
          // if (!onlineUserList[index].user.toLowerCase().startsWith(filter.toLowerCase())) {
          //   return false;
          // }
          return onlineUserList[index].stat === 'offline' ? (
            <UserListItem
              status={onlineUserList[index].stat}
              username={onlineUserList[index].username}
              ipAddress={onlineUserList[index].ip}
              key={index}></UserListItem>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default UserListContainer;

// {Object.keys(onlineUserList).map(index => {
//   return onlineUserList[index].stat === 'online' ? (
//     <UserListItem
//       status={onlineUserList[index].stat}
//       name={onlineUserList[index].user}
//       ipAddress={onlineUserList[index].ip}
//       key={index}></UserListItem>
//   ) : null;
// })}
// {Object.keys(onlineUserList).map(index => {
//   return onlineUserList[index].stat === 'offline' ? (
//     <UserListItem
//       status={onlineUserList[index].stat}
//       name={onlineUserList[index].user}
//       ipAddress={onlineUserList[index].ip}
//       key={index}></UserListItem>
//   ) : null;
// })}
