import React, { createContext, useReducer } from 'react';
import { getFromDataBaseSync } from '../../backend/api/dbFunctions';
import { databaseMessageReducer } from './databaseMessageReducer';

const rawData = getFromDataBaseSync('allUsersList.json', './src/database/', 0, 0);
const allUsersList = rawData.len <= 0 ? {} : rawData.arr;

export const DatabaseMessageContext = createContext();

const DatabaseMessageContextProvider = props => {
  const [messageFromDatabase, dispatchDbContext] = useReducer(databaseMessageReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      const result = getFromDataBaseSync(`${key}.json`, './src/database', 0, 20);
      data[key] = result.arr.reverse();
    }
    return data;
  });

  return (
    <DatabaseMessageContext.Provider value={{ messageFromDatabase, dispatchDbContext }}>
      {props.children}
    </DatabaseMessageContext.Provider>
  );
};

export default DatabaseMessageContextProvider;
