import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #202225',
		backgroundColor: '#2f3136'
	}
})(props => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'right'
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

function UserListDropDown({ anchorEl, handleClose, handleMute, handleDelete, muted }) {
	return (
		<StyledMenu id='userlist-dropdown' open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
			<StyledMenuItem onClick={handleMute}>{muted ? 'Unmute' : 'Mute'}</StyledMenuItem>
			<StyledMenuItem onClick={handleDelete}>Delete chat</StyledMenuItem>
		</StyledMenu>
	);
}

export default UserListDropDown;
