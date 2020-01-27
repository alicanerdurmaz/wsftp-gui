import React from 'react';
import SearchListItemDb from './SearchListItemDb';

const SearchListDb = ({ list, setJumpToDb }) => {
	const date = list[0].createdAt.slice(0, 11);
	return (
		<div className='search-list-group' onClick={e => setJumpToDb(list[1].uuid)}>
			<div className='search-date'>
				<div className='search-date-text'>{date}</div>
			</div>
			<div className='search-list-group-list'>
				{list.map(e => (
					<SearchListItemDb
						key={e.uuid}
						contentType={e.contentType}
						fileName={e.fileName}
						content={e.content}
						from={e.from}
						fileStatus={e.fileStatus}
						fileType={e.fileType}></SearchListItemDb>
				))}
			</div>
		</div>
	);
};

export default SearchListDb;
