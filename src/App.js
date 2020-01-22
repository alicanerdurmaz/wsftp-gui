import React, { Fragment } from 'react';

import './App.scss';
import MainLayout from './components/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import DatabaseMessageContextProvider from './context/DatabaseMessageContext/DatabaseMessageContext';
import WriteToDatabase from './components/WriteToDatabase';
import SettingsContextProvider from './context/SettingsContext';
import UploadMediaContextProvider from './context/MediaContext/UploadMediaContext';
import DownloadMediaContextProvider from './context/MediaContext/DownloadMediaContext';

const App = () => {
  return (
    <Fragment>
      <SettingsContextProvider>
        <UploadMediaContextProvider>
          <DownloadMediaContextProvider>
            <MessageContextProvider>
              <SelectUserContextProvider>
                <DatabaseMessageContextProvider>
                  <OnlineUserContextProvider>
                    <MainLayout></MainLayout>
                    <WriteToDatabase></WriteToDatabase>
                  </OnlineUserContextProvider>
                </DatabaseMessageContextProvider>
              </SelectUserContextProvider>
            </MessageContextProvider>
          </DownloadMediaContextProvider>
        </UploadMediaContextProvider>
      </SettingsContextProvider>
    </Fragment>
  );
};

export default App;
