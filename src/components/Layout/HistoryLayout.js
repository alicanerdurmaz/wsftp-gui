import React, { useContext } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';

import fakeData from '../../data.json';
import HistoryListItem from '../HistoryListItem';

const HistoryLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);

  return (
    <div className='history-container'>
      <div className='border-bottom'>
        <div className='history-title padding-top-2'>Uploads</div>
      </div>
      <ul className='history-list'>
        {fakeData['08:00:27:fc:3d:f2'].map(e => {
          if (e.from === '*MYPC*') {
            return (
              <HistoryListItem
                key={e.uuid}
                fileName={e.fileName}
                createdAt={e.createdAt}
                fileSize={e.fileSize}
                fileType={e.fileType}
                fileDir={e.fileDir}></HistoryListItem>
            );
          } else return null;
        })}
      </ul>

      <div className='border-top border-bottom '>
        <div className='history-title'>Downloads</div>
      </div>
      <ul className='history-list'>
        {fakeData['08:00:27:fc:3d:f2'].map(e => {
          if (e.from !== '*MYPC*') {
            return (
              <HistoryListItem
                key={e.uuid}
                fileType={e.fileType}
                fileName={e.fileName}
                createdAt={e.createdAt}
                fileSize={e.fileSize}
                fileDir={e.fileDir}></HistoryListItem>
            );
          } else return null;
        })}
      </ul>
    </div>
  );
};

export default HistoryLayout;
