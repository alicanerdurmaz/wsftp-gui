import React, { createContext, useReducer, useState, useEffect, useContext } from 'react';

import { getFromDataBase } from '../../backend/api/dbFunctions';
import { databaseMessageReducer } from './databaseMessageReducer';
import { OnlineUserContext } from '../OnlineUserContext/OnlineUserContext';

export const DatabaseMessageContext = createContext();

const DatabaseMessageContextProvider = props => {
  const { onlineUserList } = useContext(OnlineUserContext);

  const [messageFromDatabase, dispatch] = useReducer(databaseMessageReducer, [], () => {
    let data = {};
    for (let key in onlineUserList) {
      const result = getFromDataBase(`${key}.json`, './src/database', 0, 20);
      data[key] = result.arr.reverse();
    }
    return data;
  });

  return (
    <DatabaseMessageContext.Provider value={{ messageFromDatabase, dispatch }}>
      {props.children}
    </DatabaseMessageContext.Provider>
  );
};

export default DatabaseMessageContextProvider;
