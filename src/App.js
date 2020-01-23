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
import OldDownloadMediaContextProvider from './context/MediaContext/OldDownloadMediaContext';
import OldUploadMediaContextProvider from './context/MediaContext/OldUploadMediaContext';

const App = () => {
  return (
    <Fragment>
      <SettingsContextProvider>
        <UploadMediaContextProvider>
          <DownloadMediaContextProvider>
            <OldDownloadMediaContextProvider>
              <OldUploadMediaContextProvider>
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
              </OldUploadMediaContextProvider>
            </OldDownloadMediaContextProvider>
          </DownloadMediaContextProvider>
        </UploadMediaContextProvider>
      </SettingsContextProvider>
    </Fragment>
  );
};

export default App;
