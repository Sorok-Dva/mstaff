const fs = require('fs');
const multer = require('multer');

module.exports.getUploader = (getDirPath, getFileName) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        let _dirPath = null;
        if (typeof getDirPath === 'string'){
          _dirPath = getDirPath;
        } else {
          _dirPath = getDirPath(req);
        }
        module.exports.mkdir(_dirPath);
        if (req.uploads === undefined)
          req.uploads = {};
        if (req.uploads[file.fieldname] === undefined)
          req.uploads[file.fieldname] = {};
        req.uploads[file.fieldname].dir = _dirPath;
        cb(null, _dirPath)
      },
      filename: (req, file, cb) => {
        let _fileName = null;
        if (getFileName){
          if (typeof getFileName === 'string'){
            _fileName = getFileName + file.originalname.split('.').pop();
          } else {
            _fileName = getFileName(file.originalname.split('.').shift(), file.originalname.split('.').pop(), req);
          }
        } else {
          _fileName = file.originalname.split('.').shift() + '-' + Date.now() + '.' + file.originalname.split('.').pop();
        }
        if (req.uploads === undefined)
          req.uploads = {};
        if (req.uploads[file.fieldname] === undefined)
          req.uploads[file.fieldname] = {};
        req.uploads[file.fieldname].name = _fileName;
        cb(null, _fileName)
      }
    })
  });
};

module.exports.mkdir = (path) => {
  const pathSplit = path.split('/');
  let _path = '';
  for (let i = 0; i < pathSplit.length; i++){
    const pathSplitElement = pathSplit[i];
    if (!pathSplitElement || pathSplitElement === '')
      continue;
    if (i > 0)
      _path += '/';
    _path += pathSplitElement;
    if (!fs.existsSync(_path)){
      fs.mkdirSync(_path)
    }
  }
};