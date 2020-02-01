import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #202225',
		backgroundColor: '#2f3136'
	}
})(props => (
	<Menu
		elevation={24}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'left'
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 20
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		backgroundColor: '#2f3136',
		color: '#eceff1',
		'&:hover': {
			backgroundColor: '#40444b'
		}
	}
}))(MenuItem);

function ThreeDotDropDown({
	deleteAll,
	anchorEl,
	handleClose,
	deleteByKeyValue,
	type,
	cancelAllWaitings,
	rejectAllWaitings,
	acceptAllWaitings
}) {
	return (
		<StyledMenu
			id='mediathreedot-dropdown'
			keepMounted
			open={Boolean(anchorEl)}
			onClose={handleClose}
			anchorEl={anchorEl}>
			<StyledMenuItem onClick={type === 'download' ? acceptAllWaitings : null}>
				{type === 'download' ? 'Accept all waitings' : ''}
			</StyledMenuItem>
			<StyledMenuItem onClick={deleteAll}>Delete all </StyledMenuItem>
			<StyledMenuItem onClick={e => deleteByKeyValue('fileStatus', FILE_STATUS.rejected)}>
				{`Delete all rejected`}
			</StyledMenuItem>
			<StyledMenuItem onClick={e => deleteByKeyValue('fileStatus', FILE_STATUS.canceled)}>
				{`Delete all canceled`}
			</StyledMenuItem>
			<StyledMenuItem onClick={e => deleteByKeyValue('fileStatus', FILE_STATUS.sent)}>
				{`Delete all sent`}
			</StyledMenuItem>
			<StyledMenuItem onClick={type === 'upload' ? cancelAllWaitings : rejectAllWaitings}>
				{type === 'upload' ? 'Cancel all waitings' : 'Reject all waitings'}
			</StyledMenuItem>
		</StyledMenu>
	);
}

export default ThreeDotDropDown;
