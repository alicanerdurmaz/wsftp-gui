import React from 'react';
import MediaHistoryLayout from './MediaHistoryLayout';
import SearchLayout from './SearchLayout';
import Spinner from '../Spinner';

const RightLayout = ({ activeRightScreen, searchLoading, searchResult, setScrollPosition }) => {
	return (
		<div className='right-area'>
			<div className={`right-container ${activeRightScreen === 'media' ? '' : 'hidden'}`}>
				<MediaHistoryLayout></MediaHistoryLayout>
			</div>
			<div className={`right-search-container ${activeRightScreen === 'search' ? '' : 'hidden'}`}>
				{searchLoading ? (
					<Spinner></Spinner>
				) : (
					<SearchLayout searchResult={searchResult} setScrollPosition={setScrollPosition}></SearchLayout>
				)}
			</div>
		</div>
	);
};

export default RightLayout;
