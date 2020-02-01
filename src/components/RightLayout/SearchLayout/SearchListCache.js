import React from 'react';
import SearchListItemCache from './SearchListItemCache';

const SearchListCache = ({ list, setScrollPosition }) => {
	const date = list[0].createdAt.slice(0, 11);
	return (
		<div className='search-list-group' onClick={e => setScrollPosition(list[1].uuid)}>
			<div className='search-date'>
				<div className='search-date-text'>{`${date[4]} · ${date[1]} ${date[2]}, ${date[3]}`}</div>
			</div>
			<div className='search-list-group-list'>
				{list.map(e => (
					<SearchListItemCache
						key={e.uuid}
						contentType={e.contentType}
						fileName={e.fileName}
						content={e.content}
						from={e.from}
						fileStatus={e.fileStatus}
						fileType={e.fileType}></SearchListItemCache>
				))}
			</div>
		</div>
	);
};

export default SearchListCache;
