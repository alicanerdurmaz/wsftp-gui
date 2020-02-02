import React, { useState, useContext, useEffect, Fragment } from 'react';

import LeftLayout from './LeftLayout/LeftLayout';
import MiddleLayout from './MiddleLayout/MiddleLayout';
import RightLayout from './RightLayout/RightLayout';
import Settings from './SettingsLayout/Settings';
import { SelectUserContext } from '../context/SelectUserContext';
import DragAndDropProvider from './DragAndDropProvider';
import { MessageContext } from '../context/MessageContext/MessageContext';
import { searchFromMessageContext } from '../Helpers/searchFrom';
import { API_getMyInfo } from '../backend/api/webSocketConnection';

const MainLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { messageHistory } = useContext(MessageContext);
	const [modalOpen, setModalOpen] = useState(false);

	const [activeRightScreen, setActiveRightScreen] = useState('media');
	const [searchResult, setSearchResult] = useState([]);
	const [scrollPosition, setScrollPosition] = useState(false);
	const [jumpToDb, setJumpToDb] = useState(false);

	const startSearch = searchTerm => {
		setActiveRightScreen('search');

		const tempData = searchFromMessageContext(
			messageHistory[selectedUser.userIdentity],
			searchTerm,
			selectedUser.userIdentity
		);

		setSearchResult(tempData);
	};

	const openSettingsScreen = () => {
		API_getMyInfo();
		setModalOpen(true);
	};

	useEffect(() => {
		setActiveRightScreen('media');
	}, [selectedUser]);

	const setActiveScreenToMedia = name => {
		setActiveRightScreen(name);
	};

	return (
		<DragAndDropProvider>
			<Settings modalOpen={modalOpen} setModalOpen={setModalOpen}></Settings>
			<LeftLayout openSettingsScreen={openSettingsScreen}></LeftLayout>

			<Fragment>
				<MiddleLayout
					startSearch={startSearch}
					scrollPosition={scrollPosition}
					setJumpToDb={setJumpToDb}
					jumpToDb={jumpToDb}
					setActiveScreenToMedia={setActiveScreenToMedia}></MiddleLayout>
				{selectedUser ? (
					<RightLayout
						activeRightScreen={activeRightScreen}
						searchResult={searchResult}
						setScrollPosition={setScrollPosition}
						setJumpToDb={setJumpToDb}></RightLayout>
				) : (
					<div className='right-area'>
						<div className={`right-container`}></div>
					</div>
				)}
			</Fragment>
		</DragAndDropProvider>
	);
};

export default MainLayout;
