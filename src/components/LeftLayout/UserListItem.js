import React, { useContext } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { ReactComponent as DesktopIcon } from '../../assets/svg/desktop.svg';
import { DatabaseMessageContext } from '../../context/DatabaseMessageContext/DatabaseMessageContext';
import { RESET_BY_NAME } from '../../context/types';

const UserListItem = ({ status, username, ipAddress, macAddress, userIdentity }) => {
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);
  const { dispatch } = useContext(DatabaseMessageContext);

  const selectUserHandler = () => {
    if (selectedUser) {
      const user = selectedUser.userIdentity;
      dispatch({
        type: RESET_BY_NAME,
        userIdentity: user
      });
    }
    setSelectedUser({
      status: status,
      username: username,
      ipAddress: ipAddress,
      macAddress: macAddress,
      userIdentity: userIdentity
    });
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
