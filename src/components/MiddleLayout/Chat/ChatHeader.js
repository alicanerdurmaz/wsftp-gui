import React, { useContext, Fragment, useState, useRef } from 'react';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { ReactComponent as AngleRight } from '../../../assets/svg/angle-right.svg';
import { ReactComponent as AngleLeft } from '../../../assets/svg/angle-left.svg';
import { ReactComponent as TimesIcon } from '../../../assets/svg/times-solid.svg';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';

const ChatHeader = ({ startSearch, setActiveScreenToMedia }) => {
	const root = useRef(document.documentElement);
	const searchInput = useRef(false);
	const { selectedUser } = useContext(SelectUserContext);
	const { onlineUserList } = useContext(OnlineUserContext);
	const [error, setError] = useState(false);
	const [isMediaOpen, setIsMediaOpen] = useState(true);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const handleKeyEvents = e => {
		if (e.keyCode === 27) {
			setActiveScreenToMedia('media');
			setIsSearchOpen(false);
			searchInput.current.value = '';
		}
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
			setIsSearchOpen(true);
		}
	};
	const handleRightLayout = () => {
		if (isMediaOpen) root.current.style.setProperty('--media-px', 0 + 'px');
		else root.current.style.setProperty('--media-px', 300 + 'px');
		setIsMediaOpen(!isMediaOpen);
	};

	const closeSearch = () => {
		setActiveScreenToMedia('media');
		setIsSearchOpen(false);
		searchInput.current.value = '';
	};

	return (
		<div className='chat-header-container'>
			<div className='chat-header-area'>
				{selectedUser ? (
					<Fragment>
						<span
							className={
								onlineUserList[selectedUser.userIdentity].event === 'online'
									? 'online-indicator bg-colorGreen'
									: 'online-indicator bg-colorGray'
							}></span>
						<div className='chat-header-username'>{onlineUserList[selectedUser.userIdentity].nick}</div>
						<div className='divider'></div>

						<input
							ref={searchInput}
							type='text'
							className='search-message'
							placeholder='Search a message'
							minLength={3}
							variant='outlined'
							onKeyDown={e => handleKeyEvents(e)}></input>
						<span className={`error-text ${error ? '' : 'hidden'}`}>
							Please lengthen this text to 3 or more
						</span>
						<div className='btn-open-media-container'>
							{isMediaOpen ? (
								<AngleRight className='btn-open-media' onClick={handleRightLayout}></AngleRight>
							) : (
								<AngleLeft className='btn-open-media' onClick={handleRightLayout}></AngleLeft>
							)}
						</div>
						{isSearchOpen ? (
							<div className='btn-close-search-container' onClick={closeSearch}>
								<TimesIcon className='btn-close-search'></TimesIcon>
							</div>
						) : null}
					</Fragment>
				) : null}
			</div>
		</div>
	);
};

export default ChatHeader;
