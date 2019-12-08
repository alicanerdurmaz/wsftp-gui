import React, { Fragment } from 'react';
import UserListContainer from '../UserListContainer';

const LeftLayout = () => {
  return (
    <Fragment>
      <div className='left-area'>
        <div className='left-container'>
          <UserListContainer></UserListContainer>
        </div>
      </div>
    </Fragment>
  );
};

export default LeftLayout;
