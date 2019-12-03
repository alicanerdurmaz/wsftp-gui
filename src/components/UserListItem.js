import React, { useContext } from 'react';
import { SelectUserContext } from '../context/SelectUserContext';
import { ReactComponent as DesktopIcon } from '../assets/svg/desktop.svg';
const UserListItem = ({ status, username, ipAddress, macAddress }) => {
  const { setSelectedUser } = useContext(SelectUserContext);
  const selectUserHandler = () => {
    setSelectedUser({ status: status, username: username, ipAddress: ipAddress, macAddress: macAddress });
  };
  return (
    <li className='user-li' onClick={selectUserHandler}>
      <div className={`user-list-container ${status}`}>
        <DesktopIcon></DesktopIcon>
        <span className='primary-text'>{username}</span>
      </div>
    </li>
  );
};
export default UserListItem;
