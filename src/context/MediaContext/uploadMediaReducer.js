import {
  MEDIA_MSG_ADDED,
  MEDIA_USER_CREATED,
  MEDIA_USER_DELETED,
  MEDIA_PROGRESS_CHANGED,
  MEDIA_PROGRESS_DONE,
  MEDIA_PROGRESS_FAIL,
  MEDIA_STATUS_CHANGED
} from '../types';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';

export const uploadMediaReducer = (state, action) => {
  console.log('UPLOAD REDUCER WORKED', action);
  switch (action.type) {
    case MEDIA_USER_CREATED:
      return { ...state, ['media:upload:' + action.userIdentity]: [] };

    case MEDIA_USER_DELETED:
      const tempState = { ...state };
      delete tempState['media:upload:' + action.userIdentity];
      return { ...tempState };

    case MEDIA_MSG_ADDED:
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

    case MEDIA_STATUS_CHANGED:
      state[`media:upload:${action.payload.dbName}`].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          element.fileStatus = action.payload.fileStatus;
        }
      });
      return { ...state };

    case MEDIA_PROGRESS_CHANGED:
      state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          const tempProgress = parseInt(action.payload.current) / parseInt(action.payload.total);
          element.progress = Math.round(tempProgress * 100);
          element.speed = action.payload.speed;
          element['port'] = action.payload.port;
        }
      });
      return { ...state };

    case MEDIA_PROGRESS_DONE:
      state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          element.fileStatus = FILE_STATUS.sent;
        }
      });
      return { ...state };
    case MEDIA_PROGRESS_FAIL:
      state[`media:upload:${action.payload.username}:${action.payload.mac}`].forEach(element => {
        if (element.uuid === action.payload.uuid) {
          element.fileStatus = FILE_STATUS.rejected;
        }
      });
      return { ...state };

    default:
      break;
  }
};
