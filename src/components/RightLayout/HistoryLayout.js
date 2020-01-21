import React, { useContext, useRef, useEffect } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { MediaContext } from '../../context/MediaContext/MediaContext';
import HistoryListItem from './HistoryListItem';
const HistoryLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { mediaList } = useContext(MediaContext);
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
      <div className='history-title-container'>
        <div className='history-title'>Uploads</div>
        <input type='text' className='history-search'></input>
      </div>
      <ul className='history-list'>
        {selectedUser &&
          mediaList['media:' + selectedUser.userIdentity] &&
          mediaList['media:' + selectedUser.userIdentity].map(e => {
            if (e.from === '*MYPC*') {
              return (
                <HistoryListItem
                  key={e.uuid}
                  fileName={e.fileName}
                  createdAt={e.createdAt}
                  fileSize={e.fileSize}
                  fileType={e.fileType}
                  fileDir={e.dir}
                  progress={e.progress}
                  fileStatus={e.fileStatus}></HistoryListItem>
              );
            } else return null;
          })}
        <div
          ref={el => {
            uploadsListEnd = el;
          }}></div>
      </ul>

      <div className='history-title-container'>
        <div className='history-title'>Downloads</div>
        <input type='text' className='history-search'></input>
      </div>
      <ul className='history-list'>
        {selectedUser &&
          mediaList['media:' + selectedUser.userIdentity] &&
          mediaList['media:' + selectedUser.userIdentity].map(el => {
            if (el.from !== '*MYPC*') {
              return (
                <HistoryListItem
                  key={el.uuid}
                  fileName={el.fileName}
                  createdAt={el.createdAt}
                  fileSize={el.fileSize}
                  fileType={el.fileType}
                  fileDir={el.dir}
                  progress={el.progress}
                  fileStatus={el.fileStatus}></HistoryListItem>
              );
            } else return null;
          })}
        <div
          ref={el => {
            downloadsListEnd = el;
          }}></div>
      </ul>
    </div>
  );
};

export default HistoryLayout;
