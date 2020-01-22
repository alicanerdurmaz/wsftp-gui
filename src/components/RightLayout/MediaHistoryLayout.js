import React, { useContext, useRef, useEffect, Fragment } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';
import MediaHistoryListItem from './MediaHistoryListItem';

const MediaHistoryLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { uploadMediaList } = useContext(UploadMediaContext);
  const { downloadMediaList } = useContext(DownloadMediaContext);

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
    <Fragment>
      <div className='media-title-container'>
        <div className='media-title'>Uploads</div>
        <input type='text' className='media-search'></input>
      </div>

      <div className='media-list-container'>
        <ul className='media-list'>
          {selectedUser &&
            uploadMediaList['media:upload:' + selectedUser.userIdentity] &&
            uploadMediaList['media:upload:' + selectedUser.userIdentity].map(e => {
              if (e.from === '*MYPC*') {
                return (
                  <MediaHistoryListItem
                    key={e.uuid}
                    fileName={e.fileName}
                    createdAt={e.createdAt}
                    fileSize={e.fileSize}
                    fileType={e.fileType}
                    fileDir={e.dir}
                    progress={e.progress}
                    fileStatus={e.fileStatus}
                    downloadDir={e.downloadDir || false}
                    from={e.from}
                    mac={e.mac}
                    uuid={e.uuid}
                    dbName={e.dbName}
                    port={e.port}></MediaHistoryListItem>
                );
              } else return null;
            })}
          <div
            ref={el => {
              uploadsListEnd = el;
            }}></div>
        </ul>
      </div>

      <div className='media-title-container'>
        <div className='media-title'>Downloads</div>
        <input type='text' className='media-search'></input>
      </div>

      <div className='media-list-container'>
        <ul className='media-list'>
          {selectedUser &&
            downloadMediaList['media:download:' + selectedUser.userIdentity] &&
            downloadMediaList['media:download:' + selectedUser.userIdentity].map(el => {
              if (el.from !== '*MYPC*') {
                return (
                  <MediaHistoryListItem
                    key={el.uuid}
                    fileName={el.fileName}
                    createdAt={el.createdAt}
                    fileSize={el.fileSize}
                    fileType={el.fileType}
                    fileDir={el.dir}
                    progress={el.progress}
                    fileStatus={el.fileStatus}
                    downloadDir={el.downloadDir || false}
                    from={el.from}
                    mac={el.mac}
                    uuid={el.uuid}
                    dbName={el.dbName}
                    port={el.port}></MediaHistoryListItem>
                );
              } else return null;
            })}
          <div
            ref={el => {
              downloadsListEnd = el;
            }}></div>
        </ul>
      </div>
    </Fragment>
  );
};

export default MediaHistoryLayout;
