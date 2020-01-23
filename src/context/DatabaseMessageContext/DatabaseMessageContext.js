import React, { createContext, useReducer } from 'react';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
import { databaseMessageReducer } from './databaseMessageReducer';

import findDbDirectory from '../../Helpers/findDbDirectory';

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

export const DatabaseMessageContext = createContext();

const DatabaseMessageContextProvider = props => {
  const [messageFromDatabase, dispatchDbContext] = useReducer(databaseMessageReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      const result = getFromDataBaseSync(`${key}.json`, findDbDirectory(), 0, 20);
      data[key] = result.arr.reverse();
    }
    return data;
  });

  return (
    <DatabaseMessageContext.Provider value={{ messageFromDatabase, dispatchDbContext }}>{props.children}</DatabaseMessageContext.Provider>
  );
};

export default DatabaseMessageContextProvider;
