import {
	UPLOAD_MEDIA_MSG_ADDED,
	UPLOAD_MEDIA_USER_CREATED,
	UPLOAD_MEDIA_USER_DELETED,
	UPLOAD_MEDIA_PROGRESS_CHANGED,
	UPLOAD_MEDIA_PROGRESS_DONE,
	UPLOAD_MEDIA_PROGRESS_FAIL,
	UPLOAD_MEDIA_STATUS_CHANGED,
	UPLOAD_DELETE_BY_KEY_VALUE
} from '../types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';

export const uploadMediaReducer = (state, action) => {
	switch (action.type) {
		case UPLOAD_MEDIA_USER_CREATED:
			return { ...state, ['media:upload:' + action.userIdentity]: [] };

		case UPLOAD_MEDIA_USER_DELETED:
			const tempState = { ...state };
			delete tempState['media:upload:' + action.userIdentity];
			return { ...tempState };

		case UPLOAD_MEDIA_MSG_ADDED:
			const dbName = 'media:upload:' + action.payload.dbName;
			if (state.hasOwnProperty(dbName)) {
				state[dbName].push(action.payload);
				return { ...state };
			} else if (!state.hasOwnProperty(dbName)) {
				state[dbName] = [];
				state[dbName].push(action.payload);
				return { ...state };
			}
			return { ...state };

		case UPLOAD_MEDIA_STATUS_CHANGED:
			state[`media:upload:${action.payload.dbName}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = action.payload.fileStatus;
					element.cause = action.payload.cause || 'standart';
				}
			});
			return { ...state };

		case UPLOAD_MEDIA_PROGRESS_CHANGED:
			state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					const tempProgress = parseInt(action.payload.current) / parseInt(action.payload.total);
					element.progress = Math.round(tempProgress * 100);
					element.speed = action.payload.speed;
					element['port'] = action.payload.port;
				}
			});
			return { ...state };

		case UPLOAD_MEDIA_PROGRESS_DONE:
			state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.sent;
				}
			});
			return { ...state };
		case UPLOAD_MEDIA_PROGRESS_FAIL:
			state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.rejected;
				}
			});
			return { ...state };
		case UPLOAD_DELETE_BY_KEY_VALUE:
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
