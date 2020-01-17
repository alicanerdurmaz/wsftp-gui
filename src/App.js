import React, { Fragment, useEffect, useState, useRef } from 'react';

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
          <OnlineUserContextProvider>
            <DatabaseMessageContextProvider>
              <MainLayout></MainLayout>
              <WriteToDatabase></WriteToDatabase>
            </DatabaseMessageContextProvider>
          </OnlineUserContextProvider>
        </SelectUserContextProvider>
      </MessageContextProvider>
    </Fragment>
  );
};

export default App;
