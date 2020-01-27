import React, { useRef } from 'react';

const SearchLayout = ({ searchResult, setScrollPosition, setJumpToDb }) => {
	const count = useRef(0);

	function createMarkup(markup) {
		return { __html: markup };
	}
	function checkIndicies(i) {
		let founded = false;
		searchResult.indices.forEach(e => {
			if (e === i) {
				founded = true;
			}
		});
		return founded;
	}
	return (
		<ul>
			{searchResult.arr &&
				searchResult.arr.map((e, i) => (
					<li key={e.uuid} style={{ display: 'flex ' }}>
						<div dangerouslySetInnerHTML={createMarkup(e.content)}></div>
						{checkIndicies(i) ? <button onClick={el => setJumpToDb(e.uuid)}>jump</button> : null}
					</li>
				))}
		</ul>
	);
};

export default SearchLayout;
