import React, { useEffect, useRef, useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import useOnScreen from '../../hooks/useOnScreen';

const RefBottomChatOldListText = ({ content, sender, createdAt, id, scrollDirection, getNewerDataFromDb }) => {
	const refOldListBottom = useRef(false);
	const isBottomOnScreen = useOnScreen(refOldListBottom);
	let user = 'other';
	if (sender === '*MYPC*') {
		user = 'user';
	}

	useEffect(() => {
		if (!isBottomOnScreen) {
			return;
		} else if (scrollDirection < 0) return;
		else {
			getNewerDataFromDb();
		}
	}, [isBottomOnScreen]);

	const createdAtToText = () => {
		if (!createdAt) return '';
		let text = `${createdAt[0]} ${createdAt[1]} ${createdAt[2]} , ${createdAt[3]} - ${createdAt[4]}`;
		return text;
	};

	return (
		<li className={`message-container ${user}`} id={id} ref={refOldListBottom}>
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

export default RefBottomChatOldListText;
