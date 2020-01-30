const { app } = require('electron').remote;
const path = require('path');
const fs = require('fs');

const findDbDirectory = () => {
	const folderName = 'custom-db';
	const dir = app.getPath('userData');
	const result = path.join(dir, path.sep, folderName);

	try {
		if (!fs.existsSync(result)) {
			fs.mkdirSync(result);
		}
	} catch (err) {}

	return result;
};

export default findDbDirectory;
