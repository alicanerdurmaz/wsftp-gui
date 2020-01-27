import React from 'react';

const ChatOldListTextMessage = ({ content, sender, createdAt, id }) => {
	let user = 'other';
	if (sender === '*MYPC*') {
		user = 'user';
	}

	return (
		<li className={`message-container ${user}`} id={id}>
			<div className={`message-content ${user}`}>
				<span className='message-p'>{content}</span>
			</div>
			<span className={`message-createdAt ${user}`}>
				<span className='createdAt-p'>● {createdAt}</span>
			</span>
		</li>
	);
};

export default ChatOldListTextMessage;
