import React, { useContext, useState, Fragment } from 'react';

import UserListItem from './UserListItem';
import { OnlineUserContext } from '../../context/OnlineUserContext/OnlineUserContext';

const UserListContainer = () => {
	const { onlineUserList } = useContext(OnlineUserContext);
	const [filter, setFilter] = useState('');

	return (
		<Fragment>
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
					if (
						typeof onlineUserList[index].username === 'undefined' &&
						typeof onlineUserList[index].nick === 'undefined'
					) {
						return false;
					} else if (!onlineUserList[index].nick.toLowerCase().startsWith(filter.toLowerCase())) {
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
								muted={onlineUserList[index].muted}
								key={index}
								nick={onlineUserList[index].nick}></UserListItem>
						);
					} else return false;
				})}
				{Object.keys(onlineUserList).map(index => {
					if (
						typeof onlineUserList[index].username === 'undefined' &&
						typeof onlineUserList[index].nick === 'undefined'
					) {
						return false;
					} else if (!onlineUserList[index].nick.toLowerCase().startsWith(filter.toLowerCase())) {
						return false;
					} else if (onlineUserList[index].event === 'offline') {
						return (
							<UserListItem
								ip={onlineUserList[index].ip}
								status={onlineUserList[index].event}
								username={onlineUserList[index].username}
								ipAddress={onlineUserList[index].ip}
								macAddress={onlineUserList[index].mac}
								userIdentity={onlineUserList[index].userIdentity}
								notificationNumber={onlineUserList[index].notificationNumber}
								muted={onlineUserList[index].muted}
								key={index}
								nick={onlineUserList[index].nick}></UserListItem>
						);
					} else return false;
				})}
			</ul>
		</Fragment>
	);
};

export default UserListContainer;
