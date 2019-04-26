const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const concat = require('concat-stream');
const streamifier = require('streamifier');

const UPLOAD_PATH = path.resolve(__dirname, '..', process.env.AVATAR_STORAGE);


let AvatarStorage = function (options) {

  function AvatarStorage(opts) {
    let baseUrl = process.env.AVATAR_BASE_URL;

    const allowedStorageSystems = ['local'];
    const allowedOutputFormats = ['jpg', 'png'];

    const defaultOptions = {
      storage: 'local',
      output: 'png',
      greyscale: false,
      quality: 70,
      square: true,
      threshold: 500,
      responsive: false,
    };

    let options = (opts && _.isObject(opts)) ? _.pick(opts, _.keys(defaultOptions)) : {};
    options = _.extend(defaultOptions, options);

    this.options = _.forIn(options, function (value, key, object) {

      switch (key) {

        case 'square':
        case 'greyscale':
        case 'responsive':
          object[key] = _.isBoolean(value) ? value : defaultOptions[key];
          break;

        case 'storage':
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedStorageSystems, value) ? value : defaultOptions[key];
          break;

        case 'output':
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedOutputFormats, value) ? value : defaultOptions[key];
          break;

        case 'quality':
          value = _.isFinite(value) ? value : Number(value);
          object[key] = (value && value >= 0 && value <= 100) ? value : defaultOptions[key];
          break;

        case 'threshold':
          value = _.isFinite(value) ? value : Number(value);
          object[key] = (value && value >= 0) ? value : defaultOptions[key];
          break;

      }

    });

    this.uploadPath = this.options.responsive ? path.join(UPLOAD_PATH, 'responsive') : UPLOAD_PATH;

    this.uploadBaseUrl = this.options.responsive ? path.join(baseUrl, 'responsive') : baseUrl;

    if (this.options.storage == 'local') {
      !fs.existsSync(this.uploadPath) && mkdirp.sync(this.uploadPath);
    }
  }

  AvatarStorage.prototype._generateRandomFilename = function () {
  };

  AvatarStorage.prototype._createOutputStream = function (filepath, cb) {
  };

  AvatarStorage.prototype._processImage = function (image, cb) {
  };

  AvatarStorage.prototype._handleFile = function (req, file, cb) {
  };

  AvatarStorage.prototype._removeFile = function (req, file, cb) {
  };

  return new AvatarStorage(options);

};

module.exports = AvatarStorage;