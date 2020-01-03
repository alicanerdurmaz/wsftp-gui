import { GET_MSG_FROM_DB, RESET_BY_NAME } from '../types';
import { getFromDataBase } from '../../backend/api/dbFunctions';
export const databaseMessageReducer = (state, action) => {
  switch (action.type) {
    //
    case GET_MSG_FROM_DB:
      const start = state[action.userIdentity].length;
      const end = start + 20;
      const result = getFromDataBase(`${action.userIdentity}.json`, './src/database', start, end);
      state[action.userIdentity].unshift(...result.arr.reverse());
      return { ...state };

    case RESET_BY_NAME:
      const result2 = getFromDataBase(`${action.userIdentity}.json`, './src/database', 0, 20);
      state[action.userIdentity] = [];
      state[action.userIdentity].push(...result2.arr.reverse());
      return { ...state };

    default:
      break;
  }
};
