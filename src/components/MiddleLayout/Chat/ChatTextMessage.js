import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
const ChatTextMessage = ({ content, sender, createdAt, uuid }) => {
	let user = 'other';
	if (sender === '*MYPC*') {
		user = 'user';
	}

	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
	};

	return (
		<li className={`message-container ${user}`} id={uuid}>
			<div className={`message-content ${user}`}>
				<span className='message-p'>{content}</span>
			</div>
			<span className={`message-createdAt ${user}`}>
				<Tooltip title={createdAtToText()} placement='bottom' interactive>
					<span className='createdAt-p'>{createdAt && createdAt[4]}</span>
				</Tooltip>
			</span>
		</li>
	);
};

export default ChatTextMessage;
