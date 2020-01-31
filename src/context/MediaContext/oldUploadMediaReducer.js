import {
	OLD_UPLOAD_DELETE_BY_KEY_VALUE,
	UPLOAD_MEDIA_GET_MSG_FROM_DB,
	UPLOAD_MEDIA_RESET_BY_NAME,
	UPLOAD_MEDIA_DELETE_DB
} from '../types';
import { getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';

export const oldUploadMediaReducer = (state, action) => {
	switch (action.type) {
		//
		case UPLOAD_MEDIA_GET_MSG_FROM_DB:
			if (!state[`media:upload:${action.userIdentity}`]) return { ...state };

			const start = state[`media:upload:${action.userIdentity}`].length;
			const end = start + 20;
			const result = getFromDataBaseSync(
				`media:upload:${action.userIdentity}.json`,
				findDbDirectory(),
				start,
				end
			);

			state[`media:upload:${action.userIdentity}`].unshift(...result.arr.reverse());

			return { ...state };

		case UPLOAD_MEDIA_RESET_BY_NAME:
			if (!state[`media:upload:${action.userIdentity}`]) return { ...state };

			const result2 = getFromDataBaseSync(`media:upload:${action.userIdentity}.json`, findDbDirectory(), 0, 20);
			state[`media:upload:${action.userIdentity}`] = [];
			state[`media:upload:${action.userIdentity}`].push(...result2.arr.reverse());

			return { ...state };

		case UPLOAD_MEDIA_DELETE_DB:
			if (!state[`media:upload:${action.userIdentity}`]) return { ...state };

			const tempState = { ...state };
			delete tempState[`media:upload:${action.userIdentity}`];

			return { ...tempState };
		case OLD_UPLOAD_DELETE_BY_KEY_VALUE:
			if (!state[`media:upload:${action.userIdentity}`]) {
				return { ...state };
			}
			const tempObj = state[`media:upload:${action.userIdentity}`].filter(e => e[action.key] !== action.value);
			state[`media:upload:${action.userIdentity}`] = tempObj;
			return { ...state };
		default:
			break;
	}
};
