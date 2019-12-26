import React, { useContext, useRef, useEffect } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';

import HistoryListItem from './HistoryListItem';

const HistoryLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  let downloadsListEnd = useRef(null);
  let uploadsListEnd = useRef(null);

  useEffect(() => {
    scrollToDownloadList();
  }, [selectedUser]);

  useEffect(() => {
    scrollToUploadList();
  }, [selectedUser]);
  const scrollToUploadList = () => {
    uploadsListEnd.scrollIntoView({ behavior: 'auto' });
  };
  const scrollToDownloadList = () => {
    downloadsListEnd.scrollIntoView({ behavior: 'auto' });
  };
  return (
    <div className='history-container'>
      <div className='border-bottom'>
        <div className='history-title padding-top-2'>Uploads</div>
      </div>
      <ul className='history-list'>
        {/* {fakeData['08:00:27:fc:3d:f2'].forEach(e => {
          if (e.from === '*MYPC*') {
            return (
              <HistoryListItem
                key={e.uuid}
                fileName={e.fileName}
                createdAt={e.createdAt}
                fileSize={e.fileSize}
                fileType={e.fileType}
                fileDir={e.dir}></HistoryListItem>
            );
          } else return null;
        })} */}
        <div
          ref={el => {
            uploadsListEnd = el;
          }}></div>
      </ul>

      <div className='border-top border-bottom '>
        <div className='history-title'>Downloads</div>
      </div>
      <ul className='history-list'>
        {/* {fakeData['08:00:27:fc:3d:f2'].forEach(e => {
          if (e.from !== '*MYPC*') {
            return (
              <HistoryListItem
                key={e.uuid}
                fileType={e.fileType}
                fileName={e.fileName}
                createdAt={e.createdAt}
                fileSize={e.fileSize}
                fileDir={e.dir}></HistoryListItem>
            );
          } else return null;
        })} */}
        <div
          ref={el => {
            downloadsListEnd = el;
          }}></div>
      </ul>
    </div>
  );
};

export default HistoryLayout;
