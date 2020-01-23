import React, { createContext, useReducer, useEffect } from 'react';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
import { oldDownloadMediaReducer } from './oldDownloadMediaReducer';

import findDbDirectory from '../../Helpers/findDbDirectory';

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

export const OldDownloadMediaContext = createContext();

const OldDownloadMediaContextProvider = props => {
  const [oldDownloadMediaList, dispatchOldDownloadMediaContext] = useReducer(oldDownloadMediaReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      const result = getFromDataBaseSync(`media:download:${key}.json`, findDbDirectory(), 0, 20);
      data['media:download:' + key] = result.arr.reverse();
    }
    return data;
  });

  useEffect(() => {
    console.log(oldDownloadMediaList);
  }, [oldDownloadMediaList]);

  return (
    <OldDownloadMediaContext.Provider value={{ oldDownloadMediaList, dispatchOldDownloadMediaContext }}>
      {props.children}
    </OldDownloadMediaContext.Provider>
  );
};

export default OldDownloadMediaContextProvider;
