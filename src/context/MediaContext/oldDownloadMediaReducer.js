import {
	DOWNLOAD_MEDIA_GET_MSG_FROM_DB,
	DOWNLOAD_MEDIA_RESET_BY_NAME,
	DOWNLOAD_MEDIA_DELETE_DB,
	DOWNLOAD_DELETE_BY_KEY_VALUE
} from '../types';
import { getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';

export const oldDownloadMediaReducer = (state, action) => {
	switch (action.type) {
		//
		case DOWNLOAD_MEDIA_GET_MSG_FROM_DB:
			if (!state[`media:download:${action.userIdentity}`]) return { ...state };

			const start = state[`media:download:${action.userIdentity}`].length;
			const end = start + 20;
			const result = getFromDataBaseSync(
				`media:download:${action.userIdentity}.json`,
				findDbDirectory(),
				start,
				end
			);

			state[`media:download:${action.userIdentity}`].unshift(...result.arr.reverse());
			return { ...state };

		case DOWNLOAD_MEDIA_RESET_BY_NAME:
			if (!state[`media:download:${action.userIdentity}`]) return { ...state };

			const result2 = getFromDataBaseSync(`media:download:${action.userIdentity}.json`, findDbDirectory(), 0, 20);
			state[`media:download:${action.userIdentity}`] = [];
			state[`media:download:${action.userIdentity}`].push(...result2.arr.reverse());
			return { ...state };

		case DOWNLOAD_MEDIA_DELETE_DB:
			if (!state[`media:download:${action.userIdentity}`]) return { ...state };

			const tempState = { ...state };
			delete tempState[`media:download:${action.userIdentity}`];
			return { ...tempState };
		case DOWNLOAD_DELETE_BY_KEY_VALUE:
			if (!state[`media:download:${action.userIdentity}`]) {
				return { ...state };
			}
			const tempObj = state[`media:download:${action.userIdentity}`].filter(
				e => e[action.key] !== action.value || e[action.key] !== 0
			);
			state[`media:download:${action.userIdentity}`] = tempObj;
			return { ...state };
		default:
			break;
	}
};
