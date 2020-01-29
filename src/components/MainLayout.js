import React, { useState, useContext, useEffect, Fragment } from 'react';

import LeftLayout from './LeftLayout/LeftLayout';
import MiddleLayout from './MiddleLayout/MiddleLayout';
import RightLayout from './RightLayout/RightLayout';
import Settings from './SettingsLayout/Settings';
import { SelectUserContext } from '../context/SelectUserContext';
import DragAndDropProvider from './DragAndDropProvider';
import { MessageContext } from '../context/MessageContext/MessageContext';
import { searchFromMessageContext } from '../Helpers/searchFrom';

const MainLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { messageHistory } = useContext(MessageContext);
	const [modalOpen, setModalOpen] = useState(false);

	const [activeRightScreen, setActiveRightScreen] = useState('media');
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const [scrollPosition, setScrollPosition] = useState(false);
	const [jumpToDb, setJumpToDb] = useState(false);

	const startSearch = searchTerm => {
		setActiveRightScreen('search');
		setSearchLoading(true);
		const tempData = searchFromMessageContext(
			messageHistory[selectedUser.userIdentity],
			searchTerm,
			setSearchLoading,
			selectedUser.userIdentity
		);
		setSearchResult(tempData);
	};

	const openSettingsScreen = () => {
		setModalOpen(true);
	};

	useEffect(() => {
		setActiveScreenToMedia();
	}, [selectedUser]);

	const setActiveScreenToMedia = () => {
		setActiveRightScreen('media');
	};

	return (
		<DragAndDropProvider>
			<Settings modalOpen={modalOpen} setModalOpen={setModalOpen}></Settings>
			<LeftLayout openSettingsScreen={openSettingsScreen}></LeftLayout>
			{selectedUser ? (
				<Fragment>
					<MiddleLayout
						startSearch={startSearch}
						scrollPosition={scrollPosition}
						setJumpToDb={setJumpToDb}
						jumpToDb={jumpToDb}
						setActiveScreenToMedia={setActiveScreenToMedia}></MiddleLayout>
					<RightLayout
						activeRightScreen={activeRightScreen}
						searchLoading={searchLoading}
						searchResult={searchResult}
						setScrollPosition={setScrollPosition}
						setJumpToDb={setJumpToDb}></RightLayout>
				</Fragment>
			) : (
				<h1>SELECT USER FROM LEFT</h1>
			)}
		</DragAndDropProvider>
	);
};

export default MainLayout;
