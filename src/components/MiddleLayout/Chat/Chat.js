import React, { Fragment, useState, useRef, useEffect, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import ChatHeader from '../Chat/ChatHeader';
import ChatList from '../Chat/ChatList';
import ChatInput from '../Chat/ChatInput';
import ChatOldList from '../Chat/ChatOldList';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';
import { getBlockFromDataBaseSync } from '../../../backend/api/dbFunctions';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import { OnlineUserContext } from '../../../context/OnlineUserContext/OnlineUserContext';
import { RESET_BY_NAME, GET_MSG_FROM_DB } from '../../../context/types';
import findDbDirectory from '../../../Helpers/findDbDirectory';

const Chat = ({ startSearch, scrollPosition, jumpToDb, setJumpToDb, setActiveScreenToMedia }) => {
	const { selectedUser } = useContext(SelectUserContext);
	const { onlineUserList } = useContext(OnlineUserContext);
	const { resetNotificationNumber, incrementNotificationNumber } = useContext(OnlineUserContext);
	const { messageFromDatabase, dispatchDbContext } = useContext(DatabaseMessageContext);
	const { messageHistory, lastIncomingMessage } = useContext(MessageContext);

	const [hidden, setHidden] = useState('hidden');

	let refScroller = useRef(false);
	const btnJumpP = useRef(false);
	const [scrollDirection, setScrollDirection] = useState(false);

	const [snackbarOptions, setsnackbarOptions] = useState({
		open: false,
		vertical: 'top',
		horizontal: 'left',
		message: ''
	});
	const { vertical, horizontal, open, message } = snackbarOptions;

	useEffect(() => {
		if (selectedUser && selectedUser.userIdentity === lastIncomingMessage.current) {
			if (hidden === 'hidden') {
				return;
			}
		}
		incrementNotificationNumber(lastIncomingMessage);
	}, [messageHistory]);

	useEffect(() => {
		jumpToBottom('auto');
	}, [selectedUser]);

	const jumpToBottom = type => {
		if (!selectedUser) return;

		let tempNotificationNumber = onlineUserList[selectedUser.userIdentity].notificationNumber;
		let offSet = tempNotificationNumber * 76;

		if (tempNotificationNumber > 7) openSnackbar(`${tempNotificationNumber} Unread Message`);

		dispatchDbContext({
			type: RESET_BY_NAME,
			userIdentity: selectedUser.userIdentity
		});
		refScroller.scrollTo({
			top: refScroller.scrollHeight - offSet,
			left: 0,
			behavior: type
		});
		resetNotificationNumber(selectedUser.userIdentity);
	};

	const openSnackbar = msg => {
		setsnackbarOptions({ ...snackbarOptions, open: true, message: msg });
	};
	const closeSnackbar = () => {
		setsnackbarOptions({ ...snackbarOptions, open: false });
	};

	useEffect(() => {
		if (!scrollPosition) return;

		const element = document.getElementById(scrollPosition);
		const position = element.offsetTop;
		refScroller.scrollTo({
			top: position - 100,
			left: 0,
			behavior: 'auto'
		});
		element.classList.add('highlight');
		setTimeout(() => {
			element.classList.remove('highlight');
		}, 500);
	}, [scrollPosition]);

	useEffect(() => {
		if (!jumpToDb) return;
		const result = getBlockFromDataBaseSync(
			`${selectedUser.userIdentity}.json`,
			findDbDirectory(),
			'uuid',
			jumpToDb,
			20,
			20
		);
		dispatchDbContext({
			type: GET_MSG_FROM_DB,
			userIdentity: selectedUser.userIdentity,
			data: result.arr.reverse()
		});
	}, [jumpToDb]);

	useEffect(() => {
		if (!jumpToDb) return;
		const element = document.getElementById(jumpToDb);
		const position = element.offsetTop;
		refScroller.scrollTo({
			top: position - 100,
			left: 0,
			behavior: 'auto'
		});
		setJumpToDb(false);
		element.classList.add('highlight');
		setTimeout(() => {
			element.classList.remove('highlight');
		}, 500);
	}, [messageFromDatabase]);

	const handleWheel = e => {
		setScrollDirection(e.deltaY);
	};
	const handleKeyDown = e => {
		if (e.keyCode === 38) {
			setScrollDirection(-10);
		} else if (e.keyCode === 40) {
			setScrollDirection(10);
		}
	};

	return (
		<Fragment>
			<ChatHeader startSearch={startSearch} setActiveScreenToMedia={setActiveScreenToMedia}></ChatHeader>
			{selectedUser ? (
				<Fragment>
					<div className={`chat-read-container `} ref={e => (refScroller = e)}>
						<ul
							className='chat-list'
							onWheel={e => handleWheel(e)}
							onKeyDown={e => handleKeyDown(e)}
							tabIndex='0'>
							<Fragment>
								<ChatOldList scrollDirection={scrollDirection} jumpToDb={jumpToDb}></ChatOldList>
								<ChatList setHidden={setHidden} jumpToBottom={jumpToBottom}></ChatList>
							</Fragment>
						</ul>
					</div>

					<button
						className={`btn-jumpToPresent ${hidden}`}
						onClick={e => jumpToBottom('auto')}
						ref={btnJumpP}>
						<span>Jump to Present</span>
					</button>

					<div className='chat-input-container'>
						<ChatInput></ChatInput>
					</div>
				</Fragment>
			) : null}
			<Snackbar
				style={{ top: '43px', left: '172px' }}
				anchorOrigin={{ vertical, horizontal }}
				key={`${vertical},${horizontal}`}
				open={open}
				onClose={closeSnackbar}
				message={message}
				autoHideDuration={5000}
			/>
		</Fragment>
	);
};

export default Chat;
