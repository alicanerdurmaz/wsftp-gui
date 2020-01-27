import { findFromDataBaseSync } from '../backend/api/dbFunctions';
import findDbDirectory from './findDbDirectory';

export const searchFunction = async (searchTerm, setLoading, dbName) => {
	const foundedList = findFromDataBaseSync(dbName + '.json', findDbDirectory(), 'content', searchTerm);

	setLoading(false);
	return foundedList;
};

// data.forEach((e, i) => {
// 	if (e.contentType === 'text') {
// 		if (e.content.toUpperCase().includes(searchTerm.toUpperCase())) {
// 			foundedList.push([]);

// 			const index = foundedList.length - 1;

// 			foundedList[index].push({});
// 			foundedList[index].push({});
// 			foundedList[index].push({});

// 			if (!data[i - 1]) {
// 				foundedList[index][0] = { ...e };
// 				foundedList[index][1] = { ...data[i + 1] };
// 				foundedList[index][2] = { ...data[i + 2] };
// 			} else if (!data[i + 1]) {
// 				foundedList[index][0] = { ...data[i - 2] };
// 				foundedList[index][1] = { ...data[i - 1] };
// 				foundedList[index][2] = { ...e };
// 			} else {
// 				foundedList[index][0] = { ...data[i - 1] };
// 				foundedList[index][1] = { ...e };
// 				foundedList[index][2] = { ...data[i + 1] };
// 			}
// 		}
// 	}
// 	if (e.contentType === 'file') {
// 		if (e.fileName.toUpperCase().includes(searchTerm.toUpperCase())) {
// 			foundedList.push([]);

// 			const index = foundedList.length - 1;

// 			foundedList[index].push({});
// 			foundedList[index].push({});
// 			foundedList[index].push({});

// 			if (!data[i - 1]) {
// 				foundedList[index][0] = { ...e };
// 				foundedList[index][1] = { ...data[i + 1] };
// 				foundedList[index][2] = { ...data[i + 2] };
// 			} else if (!data[i + 1]) {
// 				foundedList[index][0] = { ...data[i - 2] };
// 				foundedList[index][1] = { ...data[i - 1] };
// 				foundedList[index][2] = { ...e };
// 			} else {
// 				foundedList[index][0] = { ...data[i - 1] };
// 				foundedList[index][1] = { ...e };
// 				foundedList[index][2] = { ...data[i + 1] };
// 			}
// 		}
// 	}
// });
