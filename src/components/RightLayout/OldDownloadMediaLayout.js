import React, { useContext, Fragment, useEffect, useRef } from 'react';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import OldMediaListItem from './OldMediaListItem';
import useOnScreen from '../hooks/useOnScreen';
import { DOWNLOAD_MEDIA_GET_MSG_FROM_DB } from '../../context/types';

const OldDownloadMediaLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const { oldDownloadMediaList, dispatchOldDownloadMediaContext } = useContext(OldDownloadMediaContext);

  const topOfDownloadList = useRef(null);
  const onScreen = useOnScreen(topOfDownloadList);

  useEffect(() => {
    if (!onScreen) return;
    dispatchOldDownloadMediaContext({ type: DOWNLOAD_MEDIA_GET_MSG_FROM_DB, userIdentity: selectedUser.userIdentity });
  }, [onScreen]);

  return (
    <Fragment>
      {selectedUser ? (
        <Fragment>
          <div className='load-more '>
            <span className='load-more-text'></span>
            <span className='download-list-top' ref={topOfDownloadList}></span>
          </div>
          {oldDownloadMediaList[`media:download:${selectedUser.userIdentity}`] &&
            oldDownloadMediaList[`media:download:${selectedUser.userIdentity}`].map(e => {
              return (
                <OldMediaListItem
                  key={e.uuid}
                  fileName={e.fileName}
                  createdAt={e.createdAt}
                  fileSize={e.fileSize}
                  fileType={e.fileType}
                  fileDir={e.dir}
                  fileStatus={e.fileStatus}
                  downloadDir={e.downloadDir || false}
                  from={e.from}></OldMediaListItem>
              );
            })}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default OldDownloadMediaLayout;
