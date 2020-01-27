import React, { createContext, useReducer, useEffect } from 'react';
import { downloadMediaReducer } from './downloadMediaReducer';

export const DownloadMediaContext = createContext();
const DownloadMediaContextProvider = props => {
	const [downloadMediaList, dispatchDownloadMediaContext] = useReducer(downloadMediaReducer, {});

	return (
		<DownloadMediaContext.Provider value={{ downloadMediaList, dispatchDownloadMediaContext }}>
			{props.children}
		</DownloadMediaContext.Provider>
	);
};

export default DownloadMediaContextProvider;
