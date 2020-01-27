import React from 'react';
const { dialog } = window.require('electron').remote;

const ChangeDownloadDirectory = ({ settings, setSettings }) => {
	const openFileExplorer = async e => {
		const result = await dialog.showOpenDialogSync({ properties: ['openDirectory'] });
		if (result !== undefined) {
			const tempObj = { ...settings };
			tempObj.downloadDirectory = result[0];
			setSettings(tempObj);
		}
	};
	return (
		<div className='modal-changedir-container'>
			<div className='modal-section-title'>Change Download Directory</div>
			<div className='modal-changedir-section'>
				<input type='text' className='directory-input' disabled value={settings.downloadDirectory}></input>
				<button onClick={e => openFileExplorer(e)} className='modal-btn-openexplorer bg-colorPrimaryLight'>
					Open Explorer
				</button>
			</div>
		</div>
	);
};

export default ChangeDownloadDirectory;
