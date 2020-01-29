import React, { useContext, Fragment } from 'react';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';
import { SelectUserContext } from '../../context/SelectUserContext';
import OldMediaListItem from './OldMediaListItem';
import DownRefOldMediaHistoryListItem from './DownRefOldMediaHistoryListItem';

const OldDownloadMediaLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { oldDownloadMediaList } = useContext(OldDownloadMediaContext);

	return (
		<Fragment>
			{selectedUser &&
				oldDownloadMediaList['media:download:' + selectedUser.userIdentity] &&
				oldDownloadMediaList['media:download:' + selectedUser.userIdentity].map((e, i) =>
					i === 0 ? (
						<DownRefOldMediaHistoryListItem
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
						</DownRefOldMediaHistoryListItem>
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

export default OldDownloadMediaLayout;
