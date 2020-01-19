import React, { useState, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';
import { ReactComponent as CloseIcon } from '../assets/svg/times-solid.svg';
import { ReactComponent as EditIcon } from '../assets/svg/edit.svg';
import { writeObject, getSettings } from '../backend/api/dbFunctions';
import { API_refreshOnlineUserList } from '../backend/api/webSocketConnection';
const os = require('os');

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const Settings = ({ modalOpen, setModalOpen }) => {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const userInfo = useRef(os.userInfo().username);

  const handleOpenEdit = () => {
    if (openEdit) return;
    setOpenEdit(true);
  };
  const btnSaveEdit = () => {
    if (newUsername.length < 3 || newUsername.length > 24) {
      console.log('between 3-24');
      return;
    }
    const obj = { username: newUsername };
    writeObject('wsftp-settings.json', 'docu', obj);
    setOpenEdit(false);
    API_refreshOnlineUserList();
  };

  const btnDefaultEdit = () => {
    setNewUsername(userInfo.current);
  };
  const btnCancelEdit = () => {
    setOpenEdit(false);
  };
  return (
    <div>
      <Modal
        disableBackdropClick
        // disableEscapeKeyDown
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={modalOpen}
        onClose={e => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 100
        }}>
        <Zoom in={modalOpen}>
          <div className={classes.paper}>
            <div className='modal-close-btn'>
              <div>
                <CloseIcon className='modal-close-icon'></CloseIcon>
              </div>
              <span>ESC</span>
            </div>
            <div className='modal-container'>
              <div className='modal-my-account-container'>
                <div className='modal-section-title'>My Account</div>
                <div className='modal-my-account-info-container'>
                  <div className='modal-my-account-info-section'>
                    <div>
                      <span className='modal-modal-my-account-title clickable' onClick={handleOpenEdit}>
                        USERNAME
                      </span>
                      <span className='btn-edit' onClick={handleOpenEdit}>
                        <EditIcon className='edit-icon'></EditIcon>
                      </span>
                    </div>
                    <span className='modal-modal-my-account-text'>{userInfo.current}</span>
                    {openEdit ? (
                      <div className='username-edit-area'>
                        <input
                          maxLength='24'
                          type='text'
                          className='username-input'
                          value={newUsername}
                          placeholder={`Enter new username`}
                          onChange={e => setNewUsername(e.target.value)}></input>
                        <div className='modal-btn-group'>
                          <button className='modal-btn bg-colorGreen' onClick={btnSaveEdit}>
                            Save
                          </button>
                          <button className='modal-btn bg-colorBlue' onClick={btnDefaultEdit}>
                            Default
                          </button>
                          <button className='modal-btn bg-colorRed' onClick={btnCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className='two-text-group'>
                    <div className='modal-my-account-info-section'>
                      <span className='modal-modal-my-account-title'>IP ADDRESS</span>
                      <span className='modal-modal-my-account-text'>192.168.1.23</span>
                    </div>
                    <div className='modal-my-account-info-section'>
                      <span className='modal-modal-my-account-title'>Mac ADDRESS</span>
                      <span className='modal-modal-my-account-text'>08:00:27:fc:3d:f2</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-changedir-container'>
                <div className='modal-section-title'>Change Download Directory</div>
                <div className='modal-changedir-section'>
                  <input type='text' className='username-input'></input>
                </div>
              </div>
            </div>
          </div>
        </Zoom>
      </Modal>
    </div>
  );
};

export default Settings;
