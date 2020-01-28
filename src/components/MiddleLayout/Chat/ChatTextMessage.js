import React from 'react';

const ChatTextMessage = ({ content, sender, createdAt, uuid }) => {
	let user = 'other';
	if (sender === '*MYPC*') {
		user = 'user';
	}
	return (
		<li className={`message-container ${user}`} id={uuid}>
			<div className={`message-content ${user}`}>
				<span className='message-p'>{content}</span>
			</div>
			<span className={`message-createdAt ${user}`}>
				<span className='createdAt-p'>{createdAt[4]}</span>
			</span>
		</li>
	);
};

export default ChatTextMessage;
