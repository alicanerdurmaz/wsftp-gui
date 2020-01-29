import React, { useContext, Fragment, useRef, useEffect } from 'react';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import OldMediaListItem from './OldMediaListItem';
import UpRefOldMediaHistoryListItem from './UpRefOldMediaHistoryListItem';

const OldUploadMediaLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { oldUploadMediaList } = useContext(OldUploadMediaContext);

	return (
		<Fragment>
			{selectedUser &&
				oldUploadMediaList['media:upload:' + selectedUser.userIdentity] &&
				oldUploadMediaList['media:upload:' + selectedUser.userIdentity].map((e, i) =>
					i === 0 ? (
						<UpRefOldMediaHistoryListItem
							i={i}
							key={e.uuid}
							fileName={e.fileName}
							createdAt={e.createdAt}
							fileSize={e.fileSize}
							fileType={e.fileType}
							fileDir={e.dir}
							fileStatus={e.fileStatus}
							downloadDir={e.downloadDir || false}
							from={e.from}>
							>
						</UpRefOldMediaHistoryListItem>
					) : (
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
					)
				)}
		</Fragment>
	);
};

export default OldUploadMediaLayout;
