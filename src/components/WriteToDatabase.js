import React, { Fragment, useEffect, useContext } from 'react';
import { writeToDataBaseArray, writeObject } from '../backend/api/dbFunctions';
import { MessageContext } from '../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../context/OnlineUserContext/OnlineUserContext';
import { SettingsContext } from '../context/SettingsContext';
import findDbDirectory from '../Helpers/findDbDirectory';
import { MediaContext } from '../context/MediaContext/MediaContext';

const { ipcRenderer } = require('electron');

const WriteToDatabase = () => {
  const { messageHistory } = useContext(MessageContext);
  const { onlineUserList } = useContext(OnlineUserContext);
  const { mediaList } = useContext(MediaContext);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const saveToDatabase = () => {
      const allUsersListJson = { ...onlineUserList };
      const settingsJson = { ...settings };
      Object.keys(allUsersListJson).forEach(key => {
        allUsersListJson[key].event = 'offline';
      });
      writeObject('settings.json', findDbDirectory(), settingsJson);
      writeObject('allUsersList.json', findDbDirectory(), allUsersListJson);
      Object.keys(messageHistory).length
        ? Object.keys(messageHistory).forEach(key => {
            writeToDataBaseArray(`${key}.json`, findDbDirectory(), messageHistory[key], () => {
              ////
              Object.keys(mediaList).length
                ? Object.keys(mediaList).forEach(key => {
                    writeToDataBaseArray(`${key}.json`, findDbDirectory(), mediaList[key], () => {
                      ipcRenderer.send('save-completed');
                    });
                  })
                : ipcRenderer.send('save-completed');
            });
          })
        : ipcRenderer.send('save-completed');
    };
    ipcRenderer.on('app-close', saveToDatabase);
    return () => {
      ipcRenderer.removeListener('app-close', saveToDatabase);
    };
  }, [messageHistory, onlineUserList, settings]);

  return <Fragment></Fragment>;
};

export default WriteToDatabase;
