import React, { useContext, useState } from 'react';

import UserListItem from './UserListItem';
import { OnlineUserContext } from '../../context/OnlineUserContext/OnlineUserContext';

const UserListContainer = () => {
	const { onlineUserList } = useContext(OnlineUserContext);
	const [filter, setFilter] = useState('');

	return (
		<div>
			<ul className='user-ul'>
				<li className='user-li nohighlight'>
					<input
						type='text'
						className='search-user'
						placeholder='Search a user'
						value={filter}
						onChange={e => setFilter(e.currentTarget.value)}></input>
				</li>
				{Object.keys(onlineUserList).map(index => {
					if (typeof onlineUserList[index].username === 'undefined') {
						return false;
					} else if (!onlineUserList[index].username.toLowerCase().startsWith(filter.toLowerCase())) {
						return false;
					} else if (onlineUserList[index].event === 'online') {
						return (
							<UserListItem
								status={onlineUserList[index].event}
								username={onlineUserList[index].username}
								ip={onlineUserList[index].ip}
								macAddress={onlineUserList[index].mac}
								userIdentity={onlineUserList[index].userIdentity}
								notificationNumber={onlineUserList[index].notificationNumber}
								isMuted={onlineUserList[index].isMuted}
								key={index}
								nick={onlineUserList[index].nick}></UserListItem>
						);
					} else return false;
				})}
				{Object.keys(onlineUserList).map(index => {
					if (typeof onlineUserList[index].username === 'undefined') {
						return false;
					} else if (!onlineUserList[index].username.toLowerCase().startsWith(filter.toLowerCase())) {
						return false;
					} else if (onlineUserList[index].event === 'offline') {
						return (
							<UserListItem
								status={onlineUserList[index].event}
								username={onlineUserList[index].username}
								ipAddress={onlineUserList[index].ip}
								macAddress={onlineUserList[index].mac}
								userIdentity={onlineUserList[index].userIdentity}
								notificationNumber={onlineUserList[index].notificationNumber}
								isMuted={onlineUserList[index].isMuted}
								key={index}></UserListItem>
						);
					} else return false;
				})}
				<li className='user-li r-border r-hover'>
					<div className='user-list-container '></div>
				</li>
			</ul>
		</div>
	);
};

export default UserListContainer;
