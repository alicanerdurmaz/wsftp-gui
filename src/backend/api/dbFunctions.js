const os = require('os');
const path = require('path');
const fs = require('fs');

const writeToDataBase = (name, dir, input, done) => {
  if (dir === 'desk') {
    dir = path.join(os.homedir(), 'Desktop');
  } else if (dir === 'down') {
    dir = path.join(os.homedir(), 'Downloads');
  } else if (dir === 'docu') {
    dir = path.join(os.homedir(), 'Documents');
  }
  let file = path.join(dir, name);
  fs.exists(file, err => {
    let exists = err ? true : false;
    if (exists) {
      fs.access(file, fs.constants.W_OK, err => {
        if (err) {
          done(err);
        }
        let arrExist = [];
        let arrNew = [];
        let str = '';
        let reader = fs.readFileSync(file, 'utf8');
        arrNew.push(input);
        if (reader !== '') {
          arrExist = JSON.parse(reader);
        }
        arrNew = arrNew.concat(arrExist);
        str = JSON.stringify(arrNew);
        fs.open(file, 'w', function(err, fd) {
          if (err) {
            done(err);
          }
          fs.write(fd, str, err => {
            if (err) {
              done(err);
            }
            fs.close(fd, () => {
              done(err);
            });
          });
        });
      });
    } else {
      fs.open(file, 'w', function(err, fd) {
        if (err) {
          done(err);
        }
        let arr = [];
        arr.push(input);
        arr = arr.reverse();
        let str = JSON.stringify(arr);
        fs.write(fd, str, function(err) {
          if (err) {
            done(err);
          }
          fs.close(fd, function() {
            done(err);
          });
        });
      });
    }
  });
};

const writeToDataBaseArray = (name, dir, arr, done) => {
  if (!arr.length) {
    return done();
  }

  let len = arr.length;
  let index = 0;

  reqSave(name, dir, arr, len, index, err => {
    done(err);
  });
};

const reqSave = (name, dir, arr, len, index, done) => {
  writeToDataBase(name, dir, arr[index], err => {
    index++;
    if (index !== len) {
      reqSave(name, dir, arr, len, index, () => {
        done(err);
      });
    } else {
      done(err);
    }
  });
};

const getFromDataBase = (name, dir, start, end, done) => {
  if (dir === 'desk') {
    dir = path.join(os.homedir(), 'Desktop');
  } else if (dir === 'down') {
    dir = path.join(os.homedir(), 'Downloads');
  } else if (dir === 'docu') {
    dir = path.join(os.homedir(), 'Documents');
  }
  let file = path.join(dir, name);
  fs.exists(file, err => {
    let exists = err ? true : false;
    let arr = [];
    if (exists) {
      fs.access(file, fs.constants.W_OK, err => {
        if (err) {
          done(err, arr, 0);
        }
        let reader = fs.readFileSync(file, 'utf8');
        if (reader !== '') {
          arr = JSON.parse(reader);
        }
        const slice = [];
        const lenarr = arr.length;
        if (start === 0 && end === 0) {
          done(err, arr, lenarr);
        } else {
          if (lenarr <= start) {
            done(err, [], -1);
          } else {
            let count = 0;
            if (end > lenarr) {
              for (let i = start; i <= lenarr - 1; i++) {
                slice.push(arr[i]);
                count++;
              }
            } else {
              for (let i = start; i < end; i++) {
                slice.push(arr[i]);
                count++;
              }
            }
            done(err, slice, count);
          }
        }
      });
    } else {
      done(false, arr, 0);
    }
  });
};

const getFromDataBaseSync = (name, dir, start, end) => {
  if (dir === 'desk') {
    dir = path.join(os.homedir(), 'Desktop');
  } else if (dir === 'down') {
    dir = path.join(os.homedir(), 'Downloads');
  } else if (dir === 'docu') {
    dir = path.join(os.homedir(), 'Documents');
  }
  let file = path.join(dir, name);
  let exist = false;
  try {
    let stat = fs.statSync(file);
    exist = true;
  } catch (err) {
    exist = false;
  }
  if (exist) {
    let arr = [];
    let reader = fs.readFileSync(file, 'utf8');
    if (reader !== '') {
      arr = JSON.parse(reader);
    }
    const slice = [];
    const lenarr = arr.length;
    if (start === 0 && end === 0) {
      return { done: true, arr: arr, len: lenarr };
    } else {
      if (lenarr <= start) {
        return { done: true, arr: [], len: -1 };
      } else {
        let count = 0;
        if (end > lenarr) {
          for (let i = start; i < lenarr; i++) {
            slice.push(arr[i]);
            count++;
          }
        } else {
          for (let i = start; i < end; i++) {
            slice.push(arr[i]);
            count++;
          }
        }
        return { done: true, arr: slice, len: count };
      }
    }
  } else {
    return { done: false, arr: [], len: -2 };
  }
};

const deleteFromDataBase = (name, dir, key, value, done) => {
  getFromDataBase(name, dir, 0, 0, (err, arr) => {
    const newArr = [];
    for (let k in arr) {
      let has = false;
      if (arr[k][key] === value) {
        has = true;
      }
      if (has === false) {
        newArr.push(arr[k]);
      }
    }
    let file = path.join(dir, name);
    fs.open(file, 'w', function(err, fd) {
      if (err) {
        done(err);
      }
      let str = JSON.stringify(newArr);
      fs.write(fd, str, function(err) {
        if (err) {
          done(err);
        }
        fs.close(fd, function() {
          done(err);
        });
      });
    });
  });
};

const deleteDataBase = (name, dir, done) => {
  let file = path.join(dir, name);
  fs.unlink(file, err => {
    done(err);
  });
};

const writeObject = (name, dir, data) => {
  let file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(data));
};

module.exports = {
  writeToDataBase: writeToDataBase,
  writeToDataBaseArray: writeToDataBaseArray,
  getFromDataBase: getFromDataBase,
  getFromDataBaseSync: getFromDataBaseSync,
  deleteFromDataBase: deleteFromDataBase,
  deleteDataBase: deleteDataBase,
  writeObject: writeObject
};
