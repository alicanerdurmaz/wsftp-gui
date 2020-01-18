import React, { Fragment } from 'react';

import MainLayout from './components/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import './App.scss';
import DatabaseMessageContextProvider from './context/DatabaseMessageContext/DatabaseMessageContext';
import WriteToDatabase from './components/WriteToDatabase';

const App = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default App;
