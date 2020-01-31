import React, { useContext, Fragment } from 'react';
import { MessageContext } from '../../context/MessageContext/MessageContext';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { deleteDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';
import {
	USER_DELETED,
	DOWNLOAD_MEDIA_USER_DELETED,
	UPLOAD_MEDIA_DELETE_DB,
	DOWNLOAD_MEDIA_DELETE_DB,
	UPLOAD_MEDIA_USER_DELETED,
	DELETE_DB
} from '../../context/types';
import { DatabaseMessageContext } from '../../context/DatabaseMessageContext/DatabaseMessageContext';

const useDeleteMessages = () => {
	const { dispatch } = useContext(MessageContext);
	const { dispatchDbContext } = useContext(DatabaseMessageContext);
	const { dispatchDownloadMediaContext } = useContext(DownloadMediaContext);
	const { dispatchUploadMediaContext } = useContext(UploadMediaContext);
	const { dispatchOldDownloadMediaContext } = useContext(OldDownloadMediaContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);

	const testFunc = userIdentity => {
		deleteDataBaseSync(`${userIdentity}.json`, findDbDirectory());
		deleteDataBaseSync(`media:upload:${userIdentity}.json`, findDbDirectory());
		deleteDataBaseSync(`media:download:${userIdentity}.json`, findDbDirectory());

		dispatch({
			type: USER_DELETED,
			userIdentity: userIdentity
		});
		dispatchDbContext({
			type: DELETE_DB,
			userIdentity: userIdentity
		});

		dispatchDownloadMediaContext({
			type: DOWNLOAD_MEDIA_USER_DELETED,
			userIdentity: userIdentity
		});
		dispatchUploadMediaContext({
			type: UPLOAD_MEDIA_USER_DELETED,
			userIdentity: userIdentity
		});
		dispatchOldDownloadMediaContext({
			type: DOWNLOAD_MEDIA_DELETE_DB,
			userIdentity: userIdentity
		});
		dispatchOldUploadMediaContext({
			type: UPLOAD_MEDIA_DELETE_DB,
			userIdentity: userIdentity
		});
	};
	return testFunc;
};

export default useDeleteMessages;
