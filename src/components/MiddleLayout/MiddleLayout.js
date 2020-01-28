import React from 'react';
import Chat from './Chat/Chat';

const MiddleLayout = ({ startSearch, scrollPosition, jumpToDb, setJumpToDb, setActiveScreenToMedia }) => {
	return (
		<div className='middle-area'>
			<div className='middle-container'>
				<Chat
					startSearch={startSearch}
					scrollPosition={scrollPosition}
					jumpToDb={jumpToDb}
					setJumpToDb={setJumpToDb}
					setActiveScreenToMedia={setActiveScreenToMedia}></Chat>
			</div>
		</div>
	);
};

export default MiddleLayout;
