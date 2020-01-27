import React from 'react';

import SearchListDb from './SearchListDb';
import SearchListCache from './SearchListCache';

const SearchLayout = ({ searchResult, setScrollPosition, setJumpToDb }) => {
	console.log(searchResult);
	return (
		<div className='search-list'>
			{searchResult.foundedFromCache &&
				searchResult.foundedFromCache.map((e, i) => (
					<SearchListCache key={i} list={e} setScrollPosition={setScrollPosition}></SearchListCache>
				))}

			{searchResult.foundedFromDb &&
				searchResult.foundedFromDb.map((e, i) => (
					<SearchListDb key={i} list={e} setJumpToDb={setJumpToDb}></SearchListDb>
				))}
		</div>
	);
};

export default SearchLayout;
