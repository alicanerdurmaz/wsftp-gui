import React, { createContext, useState, useEffect } from 'react';
import { getObject } from '../backend/api/dbFunctions';
import { debounce } from '../Helpers/debounce';
import findDbDirectory from '../Helpers/findDbDirectory';
const { app } = require('electron').remote;
export const SettingsContext = createContext();

const settingsJson = getObject('settings.json', findDbDirectory());

const SettingsContextProvider = props => {
  const [settings, setSettings] = useState(() => {
    let initialData = {};
    try {
      initialData = JSON.parse(settingsJson);
    } catch (error) {}
    const tempObject = {
      myInfo: initialData.myInfo || {},
      downloadDirectory: initialData.downloadDirectory || app.getPath('downloads'),
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    return tempObject;
  });
  console.log(settings);
  useEffect(() => {
    window.addEventListener('resize', reportWindowSize);
    return () => {
      window.removeEventListener('resize', reportWindowSize);
    };
  }, []);

  const reportWindowSize = debounce(() => {
    const tempObject = { ...settings };
    tempObject.windowSize.height = window.innerHeight;
    tempObject.windowSize.width = window.innerWidth;
    setSettings(tempObject);
  }, 250);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{props.children}</SettingsContext.Provider>;
};

export default SettingsContextProvider;
