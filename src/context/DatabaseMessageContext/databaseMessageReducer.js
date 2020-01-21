import { GET_MSG_FROM_DB, RESET_BY_NAME, DELETE_DB } from '../types';
import { getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';
const { app } = require('electron').remote;

export const databaseMessageReducer = (state, action) => {
  switch (action.type) {
    case GET_MSG_FROM_DB:
      if (typeof state[action.userIdentity].length === 'undefined') return;
      const start = state[action.userIdentity].length;
      const end = start + 20;
      const result = getFromDataBaseSync(`${action.userIdentity}.json`, findDbDirectory(), start, end);

      state[action.userIdentity].unshift(...result.arr.reverse());
      return { ...state };

    case RESET_BY_NAME:
      const result2 = getFromDataBaseSync(`${action.userIdentity}.json`, findDbDirectory(), 0, 20);
      state[action.userIdentity] = [];
      state[action.userIdentity].push(...result2.arr.reverse());
      return { ...state };
    case DELETE_DB:
      const tempState = { ...state };
      delete tempState[action.userIdentity];
      return { ...tempState };
    default:
      break;
  }
};
