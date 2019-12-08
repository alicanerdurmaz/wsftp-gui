import React from 'react';
import HistoryLayout from './HistoryLayout';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../assets/svg/download.svg';
import { ReactComponent as UploadIcon } from '../../assets/svg/upload.svg';
const RightLayout = () => {
  return (
    <div className='right-area'>
      <div className='right-container'>
        <HistoryLayout></HistoryLayout>
      </div>
    </div>
  );
};

export default RightLayout;
