import React, { useContext, Fragment, useState } from 'react';
import { SelectUserContext } from '../../../context/SelectUserContext';

const ChatHeader = ({ startSearch }) => {
	const { selectedUser } = useContext(SelectUserContext);
	const [error, setError] = useState(false);

	const handleKeyEvents = e => {
		if (e.key === 'Enter') {
			if (e.target.value.length < 3) {
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 1000);
				return;
			} else {
				startSearch(e.target.value);
			}
		}
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
							minLength={3}
							variant='outlined'
							onKeyDown={e => handleKeyEvents(e)}></input>
						<span className={`error-text ${error ? '' : 'hidden'}`}>
							Please lengthen this text to 3 or more
						</span>
					</Fragment>
				) : null}
			</div>
		</div>
	);
};

export default ChatHeader;
