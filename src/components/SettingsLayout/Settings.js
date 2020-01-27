import React, { useState, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Zoom from '@material-ui/core/Zoom';
import { ReactComponent as CloseIcon } from '../../assets/svg/times-solid.svg';

import { SettingsContext } from '../../context/SettingsContext';
import MyAccount from './MyAccount';
import ChangeDownloadDirectory from './ChangeDownloadDirectory';

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
	const { settings, setSettings } = useContext(SettingsContext);

	return (
		<Modal
			disableBackdropClick
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
							<CloseIcon className='modal-close-icon' onClick={e => setModalOpen(false)}></CloseIcon>
						</div>
						<span>ESC</span>
					</div>
					<div className='modal-container'>
						<MyAccount settings={settings}></MyAccount>
						<ChangeDownloadDirectory
							settings={settings}
							setSettings={setSettings}></ChangeDownloadDirectory>
					</div>
				</div>
			</Zoom>
		</Modal>
	);
};

export default Settings;
