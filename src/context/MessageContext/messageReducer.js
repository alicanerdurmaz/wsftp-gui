import { USER_CREATED, MESSAGE_ADDED, STATUS_CHANGED, PROGRESS_CHANGED } from '../types';

export const messageReducer = (state, action) => {
  switch (action.type) {
    case USER_CREATED:
      return { ...state, [action.username]: [] };
    case MESSAGE_ADDED:
      state[action.payload.dbName].push(action.payload);
      return { ...state };
    case STATUS_CHANGED:
      state[action.payload.dbName].map(element => {
        if (element.uuid === action.payload.uuid) {
          element.fileStatus = action.payload.fileStatus;
        }
      });
      return { ...state };
    case PROGRESS_CHANGED:
      state[action.payload.username].map(element => {
        if (element.fileSize === action.payload.total) {
          const tempProgress = parseInt(action.payload.current) / parseInt(action.payload.total);
          element.progress = tempProgress * 100;
          element.speed = action.payload.speed;
          console.log(tempProgress);
        }
      });

      return { ...state };
    default:
      break;
  }
};
