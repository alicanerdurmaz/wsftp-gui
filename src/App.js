import React, { Fragment, useEffect } from 'react';

import MainLayout from './components/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import './App.scss';
import DatabaseMessageContextProvider from './context/DatabaseMessageContext/DatabaseMessageContext';
import WriteToDatabase from './components/WriteToDatabase';
import SettingsContextProvider from './context/SettingsContext';
import MediaContextProvider from './context/MediaContext/MediaContext';

const App = () => {
  return (
    <Fragment>
      <SettingsContextProvider>
        <MediaContextProvider>
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
        </MediaContextProvider>
      </SettingsContextProvider>
    </Fragment>
  );
};

export default App;
