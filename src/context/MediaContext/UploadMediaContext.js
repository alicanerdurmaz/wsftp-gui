import React, { createContext, useReducer, useEffect } from 'react';
import { uploadMediaReducer } from './uploadMediaReducer';
import findDbDirectory from '../../Helpers/findDbDirectory';

export const UploadMediaContext = createContext();
const UploadMediaContextProvider = props => {
	const [uploadMediaList, dispatchUploadMediaContext] = useReducer(uploadMediaReducer, {});

	return (
		<UploadMediaContext.Provider value={{ uploadMediaList, dispatchUploadMediaContext }}>
			{props.children}
		</UploadMediaContext.Provider>
	);
};

export default UploadMediaContextProvider;
