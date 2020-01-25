import React, { useState, useContext, useEffect, Fragment } from 'react';

import LeftLayout from './LeftLayout/LeftLayout';
import MiddleLayout from './MiddleLayout/MiddleLayout';
import RightLayout from './RightLayout/RightLayout';
import Settings from './SettingsLayout/Settings';
import { SelectUserContext } from '../context/SelectUserContext';
import DragAndDropProvider from './DragAndDropProvider';

const MainLayout = () => {
  const { selectedUser } = useContext(SelectUserContext);
  const [modalOpen, setModalOpen] = useState(false);

  const openSettingsScreen = () => {
    setModalOpen(true);
  };

  return (
    <DragAndDropProvider>
      <Settings modalOpen={modalOpen} setModalOpen={setModalOpen}></Settings>
      <LeftLayout openSettingsScreen={openSettingsScreen}></LeftLayout>
      {selectedUser ? (
        <Fragment>
          <MiddleLayout></MiddleLayout>
          <RightLayout></RightLayout>
        </Fragment>
      ) : (
        <h1>SELECT USER FROM LEFT</h1>
      )}
    </DragAndDropProvider>
  );
};

export default MainLayout;
