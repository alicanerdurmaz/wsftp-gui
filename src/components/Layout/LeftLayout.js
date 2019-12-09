import React, { Fragment } from 'react';
import UserListContainer from '../UserListContainer';
import { ReactComponent as RefreshIcon } from '../../assets/svg/redo-alt.svg';
import { ReactComponent as SettingsIcon } from '../../assets/svg/cog-solid.svg';
import { API_refreshOnlineUserList } from '../../backend/api/webSocketConnection';
const LeftLayout = () => {
  return (
    <Fragment>
      <div className='left-area'>
        <div className='left-container'>
          <UserListContainer></UserListContainer>
        </div>
        <div className='options-area'>
          <div className='options-btn-group'>
            <RefreshIcon className='refresh-button' onClick={API_refreshOnlineUserList}></RefreshIcon>
            <SettingsIcon className='settings-button' onClick={null}></SettingsIcon>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LeftLayout;
