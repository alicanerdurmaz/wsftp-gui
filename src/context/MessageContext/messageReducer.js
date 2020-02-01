import {
	USER_CREATED,
	MESSAGE_ADDED,
	STATUS_CHANGED,
	PROGRESS_CHANGED,
	PROGRESS_DONE,
	PROGRESS_FAIL,
	USER_DELETED
} from '../types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';

export const messageReducer = (state, action) => {
	switch (action.type) {
		case USER_CREATED:
			return { ...state, [action.userIdentity]: [] };

		case USER_DELETED:
			const tempState = { ...state };
			delete tempState[action.userIdentity];
			return { ...tempState };

		case MESSAGE_ADDED:
			if (state.hasOwnProperty(action.payload.dbName)) {
				state[action.payload.dbName].push(action.payload);
				return { ...state };
			} else if (!state.hasOwnProperty(action.payload.dbName)) {
				state[action.payload.dbName] = [];
				state[action.payload.dbName].push(action.payload);
				return { ...state };
			}
			return { ...state };
		case STATUS_CHANGED:
			state[action.payload.dbName].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = action.payload.fileStatus;
					element.cause = action.payload.cause || 'standart';
				}
			});
			return { ...state };

		case PROGRESS_CHANGED:
			state[`${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					const tempProgress = parseFloat(action.payload.current) / parseFloat(action.payload.total);
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
		case PROGRESS_DONE:
			state[`${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.sent;
				}
			});
			return { ...state };
		case PROGRESS_FAIL:
			state[`${action.payload.username}:${action.payload.mac}`].forEach(element => {
				if (element.uuid === action.payload.uuid) {
					element.fileStatus = FILE_STATUS.rejected;
				}
			});
			return { ...state };
		default:
			break;
	}
};
