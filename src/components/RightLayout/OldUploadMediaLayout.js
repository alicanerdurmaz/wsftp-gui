import React, { useContext, Fragment, useRef, useEffect } from 'react';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import OldMediaListItem from './OldMediaListItem';
import useOnScreen from '../hooks/useOnScreen';
import { UPLOAD_MEDIA_GET_MSG_FROM_DB } from '../../context/types';

const OldUploadMediaLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { oldUploadMediaList, dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);
	const topOfUploadList = useRef(null);
	const onScreen = useOnScreen(topOfUploadList);

	useEffect(() => {
		if (!onScreen) return;
		// dispatchOldUploadMediaContext({ type: UPLOAD_MEDIA_GET_MSG_FROM_DB, userIdentity: selectedUser.userIdentity });
	}, [onScreen]);

	return (
		<Fragment>
			<div className='load-more '>
				<span className='load-more-text'></span>
				<span className='upload-list-top' ref={topOfUploadList}></span>
			</div>
			{oldUploadMediaList['media:upload:' + selectedUser.userIdentity] &&
				oldUploadMediaList['media:upload:' + selectedUser.userIdentity].map(e => {
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
	);
};

export default OldUploadMediaLayout;
