import React from 'react';
import Chat from './Chat/Chat';

const MiddleLayout = ({ startSearch, scrollPosition, jumpToDb, setJumpToDb }) => {
	return (
		<div className='middle-area'>
			<div className='middle-container'>
				<Chat
					startSearch={startSearch}
					scrollPosition={scrollPosition}
					jumpToDb={jumpToDb}
					setJumpToDb={setJumpToDb}></Chat>
			</div>
		</div>
	);
};

export default MiddleLayout;
