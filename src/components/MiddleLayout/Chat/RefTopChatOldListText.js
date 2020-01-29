import React, { useRef, useEffect, useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import useOnScreen from '../../hooks/useOnScreen';

const RefTopChatOldListText = ({ content, sender, createdAt, id, scrollDirection, getOlderDataFromDb }) => {
	const refOldListTop = useRef(false);
	const isTopOnScreen = useOnScreen(refOldListTop);

	let user = 'other';
	if (sender === '*MYPC*') {
		user = 'user';
	}

	useEffect(() => {
		if (!isTopOnScreen) return;
		else if (scrollDirection > 0) return;
		else {
			getOlderDataFromDb();
		}
	}, [isTopOnScreen]);

	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
	};

	return (
		<li className={`message-container ${user}`} id={id} ref={refOldListTop}>
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

export default RefTopChatOldListText;
