import React from 'react';
import MediaHistoryLayout from './MediaHistoryLayout';
import SearchLayout from './SearchLayout/SearchLayout';

const RightLayout = ({ activeRightScreen, searchResult, setScrollPosition, setJumpToDb }) => {
	return (
		<div className='right-area'>
			<div className={`right-container ${activeRightScreen === 'media' ? '' : 'display-none'}`}>
				<MediaHistoryLayout></MediaHistoryLayout>
			</div>
			<div className={`right-search-container ${activeRightScreen === 'search' ? '' : 'display-none'}`}>
				<SearchLayout
					searchResult={searchResult}
					setScrollPosition={setScrollPosition}
					setJumpToDb={setJumpToDb}></SearchLayout>
			</div>
		</div>
	);
};

export default RightLayout;
