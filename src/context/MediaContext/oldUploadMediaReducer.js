import { UPLOAD_MEDIA_GET_MSG_FROM_DB, UPLOAD_MEDIA_RESET_BY_NAME, UPLOAD_MEDIA_DELETE_DB } from '../types';
import { getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';

export const oldUploadMediaReducer = (state, action) => {
  switch (action.type) {
    //
    case UPLOAD_MEDIA_GET_MSG_FROM_DB:
      if (typeof state[`media:upload:${action.userIdentity}`].length === 'undefined') return;
      const start = state[`media:upload:${action.userIdentity}`].length;
      const end = start + 20;
      const result = getFromDataBaseSync(`media:upload:${action.userIdentity}.json`, findDbDirectory(), start, end);

      state[`media:upload:${action.userIdentity}`].unshift(...result.arr.reverse());
      return { ...state };

    case UPLOAD_MEDIA_RESET_BY_NAME:
      const result2 = getFromDataBaseSync(`media:upload:${`media:upload:${action.userIdentity}`}.json`, findDbDirectory(), 0, 20);
      state[`media:upload:${action.userIdentity}`] = [];
      state[`media:upload:${action.userIdentity}`].push(...result2.arr.reverse());
      return { ...state };

    case UPLOAD_MEDIA_DELETE_DB:
      const tempState = { ...state };
      delete tempState[`media:upload:${action.userIdentity}`];
      return { ...tempState };

    default:
      break;
  }
};
