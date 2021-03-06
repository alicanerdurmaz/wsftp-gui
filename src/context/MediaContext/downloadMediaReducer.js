import {
	DOWNLOAD_MEDIA_MSG_ADDED,
	DOWNLOAD_MEDIA_USER_CREATED,
	DOWNLOAD_MEDIA_USER_DELETED,
	DOWNLOAD_MEDIA_PROGRESS_CHANGED,
	DOWNLOAD_MEDIA_PROGRESS_DONE,
	DOWNLOAD_MEDIA_PROGRESS_FAIL,
	DOWNLOAD_MEDIA_STATUS_CHANGED,
	DOWNLOAD_ADD_DOWNLOAD_DIR,
	OLD_DOWNLOAD_DELETE_BY_KEY_VALUE,
	DOWNLOAD_DELETE_BY_KEY_VALUE
} from '../types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';

export const downloadMediaReducer = (state, action) => {
	switch (action.type) {
		case DOWNLOAD_MEDIA_USER_CREATED:
			return { ...state, ['media:download:' + action.userIdentity]: [] };

		case DOWNLOAD_MEDIA_USER_DELETED:
			const tempState = { ...state };
			delete tempState['media:download:' + action.userIdentity];
			return { ...tempState };

		case DOWNLOAD_MEDIA_MSG_ADDED:
			const dbName = 'media:download:' + action.payload.dbName;
			if (state.hasOwnProperty(dbName)) {
				state[dbName].push(action.payload);
				return { ...state };
			} else if (!state.hasOwnProperty(dbName)) {
				state[dbName] = [];
				state[dbName].push(action.payload);
				return { ...state };
			}
			return { ...state };

		case DOWNLOAD_MEDIA_STATUS_CHANGED:
			state[`media:download:${action.payload.dbName}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = action.payload.fileStatus;
					element.cause = action.payload.cause || 'standart';
				}
			});
			return { ...state };

		case DOWNLOAD_MEDIA_PROGRESS_CHANGED:
			state[`media:download:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					const tempProgress = parseInt(action.payload.current) / parseInt(action.payload.total);
					element.progress = Math.round(tempProgress * 100);
					element.speed = action.payload.speed;
					element['port'] = action.payload.port;
					element.current = action.payload.current;
					element['det'] =
						action.payload.current > 0
							? (element.fileSize - action.payload.current) / (action.payload.speed * 1024)
							: false;
				}
			});

			return { ...state };

		case DOWNLOAD_MEDIA_PROGRESS_DONE:
			state[`media:download:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.sent;
				}
			});
			return { ...state };
		case DOWNLOAD_MEDIA_PROGRESS_FAIL:
			state[`media:download:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.rejected;
				}
			});
			return { ...state };
		case DOWNLOAD_ADD_DOWNLOAD_DIR:
			state[`media:download:${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.downloadDir = action.payload.dest;
				}
			});
			return { ...state };
		case DOWNLOAD_DELETE_BY_KEY_VALUE:
			if (!state[`media:download:${action.userIdentity}`]) {
				return { ...state };
			}
			const tempObj = state[`media:download:${action.userIdentity}`].filter(e => e[action.key] !== action.value);
			state[`media:download:${action.userIdentity}`] = tempObj;
			return { ...state };
		default:
			break;
	}
};
