import React, { useContext, Fragment } from 'react';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { ReactComponent as AtIcon } from '../../../assets/svg/at.svg';
const ChatHeader = () => {
	const { selectedUser } = useContext(SelectUserContext);

	const changeHandler = e => {
		console.log(e.target.value);
	};

	return (
		<div className='chat-header-container'>
			<div className='chat-header-area'>
				{selectedUser ? (
					<Fragment>
						<span
							className={
								selectedUser.status === 'online'
									? 'online-indicator bg-colorGreen'
									: 'online-indicator bg-colorGray'
							}></span>
						<div className='chat-header-username'>{selectedUser.username}</div>
						<div className='divider'></div>
						<input
							type='text'
							className='search-message'
							placeholder='Search a message'
							onChange={e => changeHandler(e)}></input>
					</Fragment>
				) : null}
			</div>
		</div>
	);
};

export default ChatHeader;
