import { USER_CREATED, MESSAGE_ADDED, STATUS_CHANGED } from '../types';

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
          element.accepted = action.payload.status;
        }
      });
      return { ...state };
    default:
      break;
  }
};
