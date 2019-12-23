import React, { Fragment, useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MainLayout from './components/Layout/MainLayout';
import SelectUserContextProvider from './context/SelectUserContext';
import OnlineUserContextProvider from './context/OnlineUserContext/OnlineUserContext';
import MessageContextProvider from './context/MessageContext/MessageContext';
import './App.scss';

const App = () => {
  return (
    <Fragment>
      <MessageContextProvider>
        <OnlineUserContextProvider>
          <SelectUserContextProvider>
            <BrowserRouter>
              <MainLayout></MainLayout>
            </BrowserRouter>
          </SelectUserContextProvider>
        </OnlineUserContextProvider>
      </MessageContextProvider>
    </Fragment>
  );
};

export default App;
