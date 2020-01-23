import React, { createContext, useReducer, useEffect } from 'react';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
import { oldUploadMediaReducer } from './oldUploadMediaReducer';

import findDbDirectory from '../../Helpers/findDbDirectory';

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

export const OldUploadMediaContext = createContext();

const OldUploadMediaContextProvider = props => {
  const [oldUploadMediaList, dispatchOldUploadMediaContext] = useReducer(oldUploadMediaReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      const result = getFromDataBaseSync(`media:upload:${key}.json`, findDbDirectory(), 0, 20);
      data['media:upload:' + key] = result.arr.reverse();
    }
    return data;
  });

  useEffect(() => {
    console.log(oldUploadMediaList);
  }, [oldUploadMediaList]);
  return (
    <OldUploadMediaContext.Provider value={{ oldUploadMediaList, dispatchOldUploadMediaContext }}>
      {props.children}
    </OldUploadMediaContext.Provider>
  );
};

export default OldUploadMediaContextProvider;
