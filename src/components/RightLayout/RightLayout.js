import React from 'react';
import MediaHistoryLayout from './MediaHistoryLayout';

const RightLayout = () => {
  return (
    <div className='right-area'>
      <div className='right-container'>
        <div className='media-container'>
          <MediaHistoryLayout></MediaHistoryLayout>
        </div>
      </div>
    </div>
  );
};

export default RightLayout;
