import React from 'react';
import MediaHistoryLayout from './MediaHistoryLayout';
import SearchLayout from './SearchLayout/SearchLayout';
import Spinner from '../Spinner';

const RightLayout = ({ activeRightScreen, searchLoading, searchResult, setScrollPosition, setJumpToDb }) => {
	return (
		<div className='right-area'>
			<div className={`right-container ${activeRightScreen === 'media' ? '' : 'hidden'}`}>
				<MediaHistoryLayout></MediaHistoryLayout>
			</div>
			<div className={`right-search-container ${activeRightScreen === 'search' ? '' : 'hidden'}`}>
				{searchLoading ? (
					<Spinner></Spinner>
				) : (
					<SearchLayout
						searchResult={searchResult}
						setScrollPosition={setScrollPosition}
						setJumpToDb={setJumpToDb}></SearchLayout>
				)}
			</div>
		</div>
	);
};

export default RightLayout;
