const { app } = require('electron').remote;
const path = require('path');

const findDbDirectory = () => {
  const folderName = 'custom-db';
  const dir = app.getPath('userData');
  const result = path.join(dir, path.sep, folderName);

  return result;
};

export default findDbDirectory;
