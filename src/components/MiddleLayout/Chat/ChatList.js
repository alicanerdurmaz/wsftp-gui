import React, { useContext, Fragment, useRef, useEffect } from 'react';
import ChatTextMessage from './ChatTextMessage';
import ChatFileMessage from './ChatFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { MessageContext } from '../../../context/MessageContext/MessageContext';
import useOnScreen from '../../hooks/useOnScreen';

const ChatList = ({ setHidden, jumpToBottom }) => {
	const { selectedUser } = useContext(SelectUserContext);
	const { messageHistory } = useContext(MessageContext);
	const refListStart = useRef(null);
	const onScreen = useOnScreen(refListStart);

	useEffect(() => {
		if (!onScreen) {
			return;
		} else {
			jumpToBottom('smooth');
		}
	}, [messageHistory]);

	useEffect(() => {
		if (!onScreen) {
			setHidden('');
		} else {
			setHidden('hidden');
		}
	}, [onScreen]);
	return (
		<Fragment>
			{messageHistory[selectedUser.userIdentity]
				? messageHistory[selectedUser.userIdentity].map(message => {
						if (message.contentType === 'text') {
							return (
								<ChatTextMessage
									uuid={message.uuid}
									key={message.uuid}
									content={message.content}
									createdAt={message.createdAt}
									sender={message.from}></ChatTextMessage>
							);
						} else if (message.contentType === 'file') {
							return (
								<ChatFileMessage
									port={message.port}
									progress={message.progress}
									key={message.uuid}
									mac={message.mac}
									fileStatus={message.fileStatus}
									from={message.from}
									dbName={message.dbName}
									createdAt={message.createdAt}
									fileType={message.fileType}
									fileSize={message.fileSize}
									fileName={message.fileName}
									dir={message.dir}
									ip={message.ip}
									uuid={message.uuid}></ChatFileMessage>
							);
						} else {
							return null;
						}
				  })
				: null}
			<span className='ref-list-start' ref={refListStart}></span>
		</Fragment>
	);
};

export default ChatList;
