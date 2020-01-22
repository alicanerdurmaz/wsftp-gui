import React, { createContext, useReducer, useEffect } from 'react';
import { downloadMediaReducer } from './downloadMediaReducer';

import findDbDirectory from '../../Helpers/findDbDirectory';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

export const DownloadMediaContext = createContext();
const DownloadMediaContextProvider = props => {
  const [downloadMediaList, dispatchDownloadMediaContext] = useReducer(downloadMediaReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      const result = getFromDataBaseSync(`media:download:${key}.json`, findDbDirectory(), 0, 20);
      data[`media:download:${key}`] = result.arr.reverse();
    }
    return data;
  });

  return (
    <DownloadMediaContext.Provider value={{ downloadMediaList, dispatchDownloadMediaContext }}>
      {props.children}
    </DownloadMediaContext.Provider>
  );
};

export default DownloadMediaContextProvider;
