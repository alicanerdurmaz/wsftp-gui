import React, { createContext, useReducer, useEffect } from 'react';
import { uploadMediaReducer } from './uploadMediaReducer';
import findDbDirectory from '../../Helpers/findDbDirectory';
import { getObject, getFromDataBaseSync } from '../../backend/api/dbFunctions';

const rawData = getObject('allUsersList.json', findDbDirectory());
let allUsersList = {};
try {
	allUsersList = JSON.parse(rawData);
} catch (error) {}

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
