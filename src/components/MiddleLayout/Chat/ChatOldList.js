import React, { useContext, Fragment, useEffect } from 'react';
import ChatOldListTextMessage from './ChatOldListTextMessage';
import ChatOldListFileMessage from './ChatOldListFileMessage';
import { SelectUserContext } from '../../../context/SelectUserContext';
import { DatabaseMessageContext } from '../../../context/DatabaseMessageContext/DatabaseMessageContext';
import { GET_MSG_FROM_DB } from '../../../context/types';
import findDbDirectory from '../../../Helpers/findDbDirectory';
import { getBlockFromDataBaseSync } from '../../../backend/api/dbFunctions';
import RefTopChatOldListText from './RefTopChatOldListText';
import RefTopChatOldListFile from './RefTopChatOldListFile';
import RefBottomChatOldListText from './RefBottomChatOldListText';
import RefBottomChatOldListFile from './RefBottomChatOldListFile';

const ChatOldList = ({ scrollDirection }) => {
	const { selectedUser } = useContext(SelectUserContext);
	const { messageFromDatabase, dispatchDbContext } = useContext(DatabaseMessageContext);

	const getOlderDataFromDb = () => {
		if (!messageFromDatabase[selectedUser.userIdentity]) return;
		if (!messageFromDatabase[selectedUser.userIdentity][0]) return;
		const id = messageFromDatabase[selectedUser.userIdentity][0].uuid;
		const result = getBlockFromDataBaseSync(
			`${selectedUser.userIdentity}.json`,
			findDbDirectory(),
			'uuid',
			id,
			20,
			20
		);

		dispatchDbContext({
			type: GET_MSG_FROM_DB,
			userIdentity: selectedUser.userIdentity,
			data: result.arr.reverse()
		});
	};

	const getNewerDataFromDb = () => {
		if (!messageFromDatabase[selectedUser.userIdentity]) return;
		let cursor = messageFromDatabase[selectedUser.userIdentity].length - 10;

		if (!messageFromDatabase[selectedUser.userIdentity][cursor]) return;

		const id = messageFromDatabase[selectedUser.userIdentity][cursor].uuid;
		const result = getBlockFromDataBaseSync(
			`${selectedUser.userIdentity}.json`,
			findDbDirectory(),
			'uuid',
			id,
			20,
			20
		);

		dispatchDbContext({
			type: GET_MSG_FROM_DB,
			userIdentity: selectedUser.userIdentity,
			data: result.arr.reverse()
		});
	};

	useEffect(() => {}, [selectedUser]);

	return (
		<Fragment>
			{messageFromDatabase[selectedUser.userIdentity] &&
				messageFromDatabase[selectedUser.userIdentity].map((message, i) => {
					if (message.contentType === 'text') {
						if (i === 0) {
							return (
								<RefTopChatOldListText
									getOlderDataFromDb={getOlderDataFromDb}
									scrollDirection={scrollDirection}
									id={message.uuid}
									key={message.uuid}
									content={message.content}
									createdAt={message.createdAt}
									sender={message.from}></RefTopChatOldListText>
							);
						} else if (i === messageFromDatabase[selectedUser.userIdentity].length - 1) {
							return (
								<RefBottomChatOldListText
									getNewerDataFromDb={getNewerDataFromDb}
									scrollDirection={scrollDirection}
									id={message.uuid}
									key={message.uuid}
									content={message.content}
									createdAt={message.createdAt}
									sender={message.from}></RefBottomChatOldListText>
							);
						} else
							return (
								<ChatOldListTextMessage
									id={message.uuid}
									key={message.uuid}
									content={message.content}
									createdAt={message.createdAt}
									sender={message.from}></ChatOldListTextMessage>
							);
					} else if (message.contentType === 'file') {
						if (i === 0) {
							return (
								<RefTopChatOldListFile
									getOlderDataFromDb={getOlderDataFromDb}
									scrollDirection={scrollDirection}
									id={message.uuid}
									key={message.uuid}
									fileStatus={message.fileStatus}
									from={message.from}
									createdAt={message.createdAt}
									fileSize={message.fileSize}
									fileName={message.fileName}
									uuid={message.uuid}></RefTopChatOldListFile>
							);
						} else if (i === messageFromDatabase[selectedUser.userIdentity].length - 1) {
							return (
								<RefBottomChatOldListFile
									getNewerDataFromDb={getNewerDataFromDb}
									scrollDirection={scrollDirection}
									id={message.uuid}
									key={message.uuid}
									fileStatus={message.fileStatus}
									from={message.from}
									createdAt={message.createdAt}
									fileSize={message.fileSize}
									fileName={message.fileName}
									uuid={message.uuid}></RefBottomChatOldListFile>
							);
						} else
							return (
								<ChatOldListFileMessage
									id={message.uuid}
									key={message.uuid}
									fileStatus={message.fileStatus}
									from={message.from}
									createdAt={message.createdAt}
									fileSize={message.fileSize}
									fileName={message.fileName}
									uuid={message.uuid}></ChatOldListFileMessage>
							);
					} else {
						return null;
					}
				})}
		</Fragment>
	);
};

export default ChatOldList;
