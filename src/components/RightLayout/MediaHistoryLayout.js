import React, { useContext, useRef, useEffect, Fragment } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';

import MediaHistoryListItem from './MediaHistoryListItem';
import OldUploadMediaLayout from './OldUploadMediaLayout';
import OldDownloadMediaLayout from './OldDownloadMediaLayout';

const MediaHistoryLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { uploadMediaList } = useContext(UploadMediaContext);
  const { downloadMediaList } = useContext(DownloadMediaContext);

  let downloadsListEnd = useRef(null);
  let uploadsListEnd = useRef(null);

  useEffect(() => {
    uploadsListEnd.scrollIntoView({ behavior: 'auto' });
    downloadsListEnd.scrollIntoView({ behavior: 'auto' });
  }, [selectedUser]);

  useEffect(() => {
    scrollToDownloadList();
  }, [downloadMediaList]);

  useEffect(() => {
    scrollToUploadList();
  }, [uploadMediaList]);

  const scrollToUploadList = () => {
    uploadsListEnd.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToDownloadList = () => {
    downloadsListEnd.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Fragment>
      <div className='media-title-container-upload'>
        <div className='media-title-upload'>Uploads</div>
        <input type='text' className='media-search-upload' placeholder='search by filename'></input>
      </div>

      <div className='media-list-container-upload'>
        <ul className='media-list-upload'>
          <OldUploadMediaLayout></OldUploadMediaLayout>
          {selectedUser &&
            uploadMediaList['media:upload:' + selectedUser.userIdentity] &&
            uploadMediaList['media:upload:' + selectedUser.userIdentity].map(e => {
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
            })}
          <li
            ref={el => {
              uploadsListEnd = el;
            }}></li>
        </ul>
      </div>

      <div className='media-title-container-download'>
        <div className='media-title-download'>Downloads</div>
        <input type='text' className='media-search-download' placeholder='search by filename'></input>
      </div>

      <div className='media-list-container-download'>
        <ul className='media-list-download'>
          <OldDownloadMediaLayout></OldDownloadMediaLayout>
          {selectedUser &&
            downloadMediaList['media:download:' + selectedUser.userIdentity] &&
            downloadMediaList['media:download:' + selectedUser.userIdentity].map(el => {
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
            })}
          <li
            ref={el => {
              downloadsListEnd = el;
            }}></li>
        </ul>
      </div>
    </Fragment>
  );
};

export default MediaHistoryLayout;
