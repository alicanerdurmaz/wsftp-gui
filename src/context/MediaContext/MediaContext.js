import React, { createContext, useReducer, useEffect } from 'react';
import { mediaReducer } from './mediaReducer';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';
import findDbDirectory from '../../Helpers/findDbDirectory';
export const MediaContext = createContext();

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
  allUsersList = JSON.parse(rawData);
} catch (error) {}

const MediaContextProvider = props => {
  const [mediaList, dispatchMediaContext] = useReducer(mediaReducer, [], () => {
    let data = {};
    for (let key in allUsersList) {
      console.log(`media:${key}.json`);
      const result = getFromDataBaseSync(`media:${key}.json`, findDbDirectory(), 0, 20);
      data['media:' + key] = result.arr.reverse();
    }
    return data;
  });
  useEffect(() => {
    console.log(mediaList);
  }, [mediaList]);
  return <MediaContext.Provider value={{ mediaList, dispatchMediaContext }}>{props.children}</MediaContext.Provider>;
};

export default MediaContextProvider;
