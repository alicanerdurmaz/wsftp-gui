import React from 'react';
import HistoryLayout from './HistoryLayout';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../assets/svg/download.svg';
import { ReactComponent as UploadIcon } from '../../assets/svg/upload.svg';
const RightLayout = () => {
  return (
    <div className='right-area'>
      <div className='right-container'>
        <header>
          <div className='two-route-buttons'>
            <div className='btn-container'>
              <NavLink to='/downloads' className='NavLink' activeClassName='selected'>
                <DownloadIcon></DownloadIcon>
                <span>Downloads</span>
              </NavLink>
            </div>
            <div className='btn-container add-border'>
              <NavLink to='/uploads' className='NavLink' activeClassName='selected'>
                <UploadIcon></UploadIcon>
                <span>Uploads</span>
              </NavLink>
            </div>
          </div>
        </header>
        <section>
          <HistoryLayout></HistoryLayout>
        </section>
      </div>
    </div>
  );
};

export default RightLayout;
