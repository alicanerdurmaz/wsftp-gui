import React from 'react';

const SearchLayout = ({ searchResult, setScrollPosition }) => {
	return (
		<ul>
			{searchResult.map((e, i) => (
				<li key={i}>
					<ul>
						{e.map(e => (
							<li key={e.uuid}>
								{e.content ? e.content : e.fileName}
								<button onClick={event => setScrollPosition(e.offset)}>jump</button>
							</li>
						))}
					</ul>
					<hr></hr>
				</li>
			))}
		</ul>
	);
};

export default SearchLayout;
