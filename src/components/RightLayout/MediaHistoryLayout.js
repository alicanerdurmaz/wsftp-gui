import React, { useContext, useRef, useEffect, Fragment, useState } from 'react';
import { SelectUserContext } from '../../context/SelectUserContext';
import { UploadMediaContext } from '../../context/MediaContext/UploadMediaContext';
import { DownloadMediaContext } from '../../context/MediaContext/DownloadMediaContext';

import MediaHistoryListItem from './MediaHistoryListItem';
import OldUploadMediaLayout from './OldUploadMediaLayout';
import OldDownloadMediaLayout from './OldDownloadMediaLayout';
import { OldUploadMediaContext } from '../../context/MediaContext/OldUploadMediaContext';
import { OldDownloadMediaContext } from '../../context/MediaContext/OldDownloadMediaContext';
import { DOWNLOAD_MEDIA_RESET_BY_NAME, UPLOAD_MEDIA_RESET_BY_NAME } from '../../context/types';
import { searchFromMediaContext } from '../../Helpers/searchFrom';
import OldMediaListItem from './OldMediaListItem';
import ThreeDotButton from './ThreeDotButton';

const MediaHistoryLayout = () => {
	const { selectedUser } = useContext(SelectUserContext);
	const { uploadMediaList } = useContext(UploadMediaContext);
	const { downloadMediaList } = useContext(DownloadMediaContext);
	const { dispatchOldUploadMediaContext } = useContext(OldUploadMediaContext);
	const { dispatchOldDownloadMediaContext } = useContext(OldDownloadMediaContext);

	const [foundedUploadList, setFoundedUploadList] = useState(false);
	const [foundedDownloadList, setFoundedDownloadList] = useState(false);

	const [errorUploadText, setErrorUploadText] = useState(false);
	const [errorDownloadText, seterrorDownloadText] = useState(false);

	const [uploadListLoading, setUploadListLoading] = useState(false);
	const [downloadListLoading, setDownloadListLoading] = useState(false);

	const [uploadSearchTerm, setUploadSearchTerm] = useState('');
	const [downloadSearchTerm, setDownloadSearchTerm] = useState('');

	let downloadsListEnd = useRef(null);
	let uploadsListEnd = useRef(null);
	let downloadListScroller = useRef(null);
	let uploadListScroller = useRef(null);

	useEffect(() => {
		uploadsListEnd.scrollIntoView({ behavior: 'auto' });
		downloadsListEnd.scrollIntoView({ behavior: 'auto' });

		dispatchOldDownloadMediaContext({
			type: DOWNLOAD_MEDIA_RESET_BY_NAME,
			userIdentity: selectedUser.userIdentity
		});
		dispatchOldUploadMediaContext({
			type: UPLOAD_MEDIA_RESET_BY_NAME,
			userIdentity: selectedUser.userIdentity
		});

		setUploadSearchTerm('');
		setDownloadSearchTerm('');
		setFoundedUploadList(false);

		setFoundedDownloadList(false);
		setUploadListLoading(false);
		setDownloadListLoading(false);
	}, [selectedUser]);

	useEffect(() => {
		const offset = 4 * 52;
		const scrollPosition = downloadListScroller.scrollHeight - downloadListScroller.scrollTop;
		if (scrollPosition - offset > downloadListScroller.clientHeight) {
			return;
		}
		scrollToDownloadList('smooth');
	}, [downloadMediaList]);

	useEffect(() => {
		const offset = 4 * 52;
		const scrollPosition = uploadListScroller.scrollHeight - uploadListScroller.scrollTop;
		if (scrollPosition - offset > uploadListScroller.clientHeight) {
			return;
		}
		scrollToUploadList('smooth');
	}, [uploadMediaList]);

	useEffect(() => {
		scrollToDownloadList('auto');
	}, [foundedDownloadList]);

	useEffect(() => {
		scrollToUploadList('auto');
	}, [foundedUploadList]);

	useEffect(() => {
		if (uploadSearchTerm.length < 1) {
			setFoundedUploadList(false);
			setUploadListLoading(false);
		}
	}, [uploadSearchTerm]);
	useEffect(() => {
		if (downloadSearchTerm.length < 1) {
			setFoundedDownloadList(false);
			setDownloadListLoading(false);
		}
	}, [downloadSearchTerm]);

	const scrollToUploadList = type => {
		uploadsListEnd.scrollIntoView({ behavior: type });
	};
	const scrollToDownloadList = type => {
		downloadsListEnd.scrollIntoView({ behavior: type });
	};

	const submitUploadSearch = async e => {
		switch (e.key) {
			//
			case 'Enter':
				if (uploadSearchTerm.length <= 1) {
					setErrorUploadText(true);
					setTimeout(() => {
						setErrorUploadText(false);
					}, 1000);
					return;
				}

				setUploadListLoading(true);
				const founded = await searchFromMediaContext(
					uploadMediaList['media:upload:' + selectedUser.userIdentity],
					e.target.value,
					`media:upload:${selectedUser.userIdentity}`
				);

				setFoundedUploadList(founded);
				setUploadListLoading(false);
				return;

			case 'Escape':
				setUploadSearchTerm('');
				setFoundedUploadList(false);
				setUploadListLoading(false);
				return;

			default:
				return;
		}
	};
	const submitDownloadSearch = e => {
		switch (e.key) {
			//
			case 'Enter':
				if (downloadSearchTerm.length <= 1) {
					seterrorDownloadText(true);
					setTimeout(() => {
						seterrorDownloadText(false);
					}, 1000);
					return;
				}
				setDownloadListLoading(true);
				const founded = searchFromMediaContext(
					downloadMediaList['media:download:' + selectedUser.userIdentity],
					e.target.value,
					`media:download:${selectedUser.userIdentity}`
				);
				setDownloadListLoading(false);
				setFoundedDownloadList(founded);
				return;

			case 'Escape':
				setDownloadSearchTerm('');
				setFoundedDownloadList(false);
				setDownloadListLoading(false);
				return;

			default:
				return;
		}
	};

	const checkIdEquality = (e, dbName) => {
		let foundedFlag = false;

		if (dbName === 'up')
			foundedUploadList['cache'].forEach(founded => {
				if (e.uuid === founded.uuid) {
					foundedFlag = true;
				}
			});
		if (dbName === 'down')
			foundedDownloadList['cache'].forEach(founded => {
				if (e.uuid === founded.uuid) {
					foundedFlag = true;
				}
			});

		return foundedFlag;
	};

	return (
		<Fragment>
			{/* UPLOAD SECTION */}
			<div className='media-title-container-upload'>
				<div className='media-title-upload'>Uploads</div>
				<input
					tabIndex={-1}
					value={uploadSearchTerm}
					onKeyDown={e => submitUploadSearch(e)}
					onChange={e => setUploadSearchTerm(e.target.value)}
					type='text'
					className='media-search-upload'
					placeholder='search by filename'></input>
				<span style={{ marginLeft: '0px' }} className={`error-text ${errorUploadText ? '' : 'hidden'}`}>
					Please lengthen this text to 2 or more
				</span>
				<ThreeDotButton
					scrollToDownloadList={scrollToDownloadList}
					scrollToUploadList={scrollToUploadList}
					type={'upload'}></ThreeDotButton>
			</div>

			<div className='media-list-container-upload'>
				<ul className='media-list-upload' ref={e => (uploadListScroller = e)}>
					{foundedUploadList ? (
						<Fragment>
							{foundedUploadList['database'].map(e => {
								return (
									<OldMediaListItem
										key={e.uuid}
										fileName={e.fileName}
										createdAt={e.createdAt}
										fileSize={e.fileSize}
										fileType={e.fileType}
										fileDir={e.dir}
										fileStatus={e.fileStatus}
										downloadDir={e.downloadDir || false}
										from={e.from}></OldMediaListItem>
								);
							})}
							{uploadMediaList['media:upload:' + selectedUser.userIdentity] &&
								uploadMediaList['media:upload:' + selectedUser.userIdentity].map(e => {
									if (checkIdEquality(e, 'up'))
										return (
											<MediaHistoryListItem
												key={e.uuid}
												fileName={e.fileName}
												createdAt={e.createdAt}
												fileSize={e.fileSize}
												fileType={e.fileType}
												fileDir={e.dir}
												progress={e.progress}
												fileStatus={e.fileStatus}
												downloadDir={e.downloadDir || false}
												from={e.from}
												mac={e.mac}
												uuid={e.uuid}
												dbName={e.dbName}
												port={e.port}
												username={e.username}
												ip={e.ip}
												nick={e.nick}></MediaHistoryListItem>
										);
									else return null;
								})}
						</Fragment>
					) : (
						<Fragment>
							<OldUploadMediaLayout></OldUploadMediaLayout>
							{uploadMediaList['media:upload:' + selectedUser.userIdentity] &&
								uploadMediaList['media:upload:' + selectedUser.userIdentity].map(e => {
									return (
										<MediaHistoryListItem
											key={e.uuid}
											fileName={e.fileName}
											createdAt={e.createdAt}
											fileSize={e.fileSize}
											fileType={e.fileType}
											fileDir={e.dir}
											progress={e.progress}
											fileStatus={e.fileStatus}
											downloadDir={e.downloadDir || false}
											from={e.from}
											mac={e.mac}
											uuid={e.uuid}
											dbName={e.dbName}
											port={e.port}
											username={e.username}
											ip={e.ip}
											nick={e.nick}></MediaHistoryListItem>
									);
								})}
						</Fragment>
					)}
					<li
						ref={el => {
							uploadsListEnd = el;
						}}></li>
				</ul>
			</div>

			{/* DOWNLOAD SECTION */}

			<div className='media-title-container-download'>
				<div className='media-title-download'>Downloads</div>
				<input
					tabIndex={-1}
					value={downloadSearchTerm}
					onKeyDown={e => submitDownloadSearch(e)}
					onChange={e => setDownloadSearchTerm(e.target.value)}
					type='text'
					className='media-search-download'
					placeholder='search by filename'></input>
				<span style={{ marginLeft: '0px' }} className={`error-text ${errorDownloadText ? '' : 'hidden'}`}>
					Please lengthen this text to 2 or more
				</span>
				<ThreeDotButton
					scrollToDownloadList={scrollToDownloadList}
					scrollToUploadList={scrollToUploadList}
					type={'download'}></ThreeDotButton>
			</div>

			<div className='media-list-container-download'>
				<ul className='media-list-download' ref={e => (downloadListScroller = e)}>
					{foundedDownloadList ? (
						<Fragment>
							{foundedDownloadList['database'].map(e => (
								<OldMediaListItem
									key={e.uuid}
									fileName={e.fileName}
									createdAt={e.createdAt}
									fileSize={e.fileSize}
									fileType={e.fileType}
									fileDir={e.dir}
									fileStatus={e.fileStatus}
									downloadDir={e.downloadDir || false}
									from={e.from}></OldMediaListItem>
							))}
							{downloadMediaList['media:download:' + selectedUser.userIdentity] &&
								downloadMediaList['media:download:' + selectedUser.userIdentity].map(e => {
									if (checkIdEquality(e, 'down'))
										return (
											<MediaHistoryListItem
												key={e.uuid}
												fileName={e.fileName}
												createdAt={e.createdAt}
												fileSize={e.fileSize}
												fileType={e.fileType}
												fileDir={e.dir}
												progress={e.progress}
												fileStatus={e.fileStatus}
												downloadDir={e.downloadDir || false}
												from={e.from}
												mac={e.mac}
												uuid={e.uuid}
												dbName={e.dbName}
												port={e.port}
												username={e.username}
												ip={e.ip}
												nick={e.nick}></MediaHistoryListItem>
										);
									else return null;
								})}
						</Fragment>
					) : (
						<Fragment>
							<OldDownloadMediaLayout></OldDownloadMediaLayout>
							{downloadMediaList['media:download:' + selectedUser.userIdentity] &&
								downloadMediaList['media:download:' + selectedUser.userIdentity].map(el => {
									return (
										<MediaHistoryListItem
											key={el.uuid}
											fileName={el.fileName}
											createdAt={el.createdAt}
											fileSize={el.fileSize}
											fileType={el.fileType}
											fileDir={el.dir}
											progress={el.progress}
											fileStatus={el.fileStatus}
											downloadDir={el.downloadDir || false}
											from={el.from}
											mac={el.mac}
											uuid={el.uuid}
											dbName={el.dbName}
											port={el.port}
											username={el.username}
											ip={el.ip}
											nick={el.nick}></MediaHistoryListItem>
									);
								})}
						</Fragment>
					)}
					<li
						ref={el => {
							downloadsListEnd = el;
						}}></li>
				</ul>
			</div>
		</Fragment>
	);
};

export default MediaHistoryLayout;
