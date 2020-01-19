import React, { useState } from 'react';

import LeftLayout from './LeftLayout/LeftLayout';
import MiddleLayout from './MiddleLayout/MiddleLayout';
import RightLayout from './RightLayout/RightLayout';
import Settings from './Settings';

const MainLayout = () => {
  const [showDnd, setShowDnd] = useState('');
  const [counter, setCounter] = useState(0);
  const [modalOpen, setModalOpen] = useState(true);

  if (counter === 0 && showDnd) {
    setShowDnd('');
  }
  if (counter === 1) {
  }
  const onDragEnterHandler = event => {
    event.stopPropagation();
    event.preventDefault();
    setCounter(counter + 1);
    setShowDnd('showDnd');
  };
  const onDragLeaveHandler = event => {
    event.stopPropagation();
    event.preventDefault();
    setCounter(counter - 1);
  };

  const onDragOverHandler = event => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };
  const onFileDropHandler = async event => {
    event.stopPropagation();
    event.preventDefault();
    setCounter(0);
    const data = await event.dataTransfer.files;
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].path);
    }
  };
  const openSettingsScreen = () => {
    console.log('openSettingsScreen');
    setModalOpen(true);
  };
  console.log(modalOpen);
  return (
    <div
      className={'main-container'}
      onDragEnter={event => onDragEnterHandler(event)}
      onDragLeave={event => onDragLeaveHandler(event)}
      onDragOver={event => onDragOverHandler(event)}
      onDrop={event => onFileDropHandler(event)}>
      <div className={`area-hidden ${showDnd}`}></div>
      <Settings modalOpen={modalOpen} setModalOpen={setModalOpen}></Settings>
      <LeftLayout openSettingsScreen={openSettingsScreen}></LeftLayout>
      <MiddleLayout></MiddleLayout>
      <RightLayout></RightLayout>
    </div>
  );
};

export default MainLayout;
