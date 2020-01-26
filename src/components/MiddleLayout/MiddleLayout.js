import React from 'react';
import Chat from './Chat/Chat';

const MiddleLayout = ({ startSearch, scrollPosition }) => {
	return (
		<div className='middle-area'>
			<div className='middle-container'>
				<Chat startSearch={startSearch} scrollPosition={scrollPosition}></Chat>
			</div>
		</div>
	);
};

export default MiddleLayout;
