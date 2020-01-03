import React, { Fragment, useEffect, useState, useRef } from 'react';

import MainLayout from './components/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import './App.scss';
import DatabaseMessageContextProvider from './context/DatabaseMessageContext/DatabaseMessageContext';

const App = () => {
  return (
    <Fragment>
      <MessageContextProvider>
        <OnlineUserContextProvider>
          <SelectUserContextProvider>
            <DatabaseMessageContextProvider>
              <MainLayout></MainLayout>
            </DatabaseMessageContextProvider>
          </SelectUserContextProvider>
        </OnlineUserContextProvider>
      </MessageContextProvider>
    </Fragment>
  );
};

export default App;
