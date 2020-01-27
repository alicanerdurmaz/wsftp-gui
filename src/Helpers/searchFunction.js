import { findFromDataBaseSync } from '../backend/api/dbFunctions';
import findDbDirectory from './findDbDirectory';

const addSpan = (str, value, index) => {
	let lenval = value.length;
	const start = `<span class="highlight">`;
	const end = `</span>`;
	return str.slice(0, index) + start + value + end + str.slice(index + lenval, str.length);
};

export const searchFunction = (messageList, searchTerm, setLoading, dbName) => {
	const arrList = JSON.parse(JSON.stringify(messageList));
	const keysToSearch = ['content', 'fileName'];
	const foundedFromDb = findFromDataBaseSync(dbName + '.json', findDbDirectory(), keysToSearch, searchTerm);
	const foundedFromCache = findFromCache(arrList, keysToSearch, searchTerm);
	foundedFromDb.arr.map(e => e.reverse());
	setLoading(false);
	return { foundedFromCache: foundedFromCache, foundedFromDb: foundedFromDb.arr };
};

const findFromCache = (arr, keys, value) => {
	let mainObject = {};
	let count = 0;
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < keys.length; j++) {
			let currKey = keys[j];
			if (arr[i][currKey] != null && arr[i][currKey] != undefined) {
				let start = arr[i][currKey].toLowerCase().indexOf(value.toLowerCase());
				if (start !== -1) {
					if (i > 0) {
						mainObject[i - 1] = arr[i - 1];
						count++;
					}
					arr[i][currKey] = addSpan(arr[i][currKey], value, start);
					mainObject[i] = arr[i];
					count++;
					if (i < arr.length - 1) {
						mainObject[i + 1] = arr[i + 1];
						count++;
					}
				}
			}
		}
	}

	const finalArray = [];
	const objKeys = Object.keys(mainObject);
	let tempArr = [];
	for (var i = 0; i < objKeys.length; i++) {
		if (objKeys.length - 1 === i) {
			if (parseInt(objKeys[i]) - 1 === parseInt(objKeys[i - 1])) {
				tempArr.push(mainObject[objKeys[i]]);
			} else {
				tempArr.push(mainObject[objKeys[i]]);
				finalArray.push(tempArr);
				tempArr = [];
			}
		} else {
			if (parseInt(objKeys[i]) + 1 === parseInt(objKeys[i + 1])) {
				tempArr.push(mainObject[objKeys[i]]);
			} else {
				tempArr.push(mainObject[objKeys[i]]);
				finalArray.push(tempArr);
				tempArr = [];
			}
		}
	}
	if (tempArr.length !== 0) {
		finalArray.push(tempArr);
	}
	return finalArray;
};
