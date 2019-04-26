var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Jimp = require('jimp');
var crypto = require('crypto');
var mkdirp = require('mkdirp');
var concat = require('concat-stream');
var streamifier = require('streamifier');

var UPLOAD_PATH = path.resolve(__dirname, '..', process.env.AVATAR_STORAGE);


var AvatarStorage = function(options) {

  function AvatarStorage(opts) {}

  AvatarStorage.prototype._generateRandomFilename = function () {};

  AvatarStorage.prototype._createOutputStream = function (filepath, cb) {};

  AvatarStorage.prototype._processImage = function (image, cb) {};

  AvatarStorage.prototype._handleFile = function (req, file, cb) {};

  AvatarStorage.prototype._removeFile = function (req, file, cb) {};

  return new AvatarStorage(options);

};

module.exports = AvatarStorage;