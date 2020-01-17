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
      state[action.payload.dbName].push(action.payload);
      return { ...state };

    case STATUS_CHANGED:
      state[action.payload.dbName].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          element.fileStatus = action.payload.fileStatus;
        }
      });
      return { ...state };

    case PROGRESS_CHANGED:
      state[`${action.payload.username}:${action.payload.mac}`].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          const tempProgress = parseInt(action.payload.current) / parseInt(action.payload.total);
          element.progress = Math.round(tempProgress * 100);
          element.speed = action.payload.speed;
          element['port'] = action.payload.port;
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
