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

    let options = opts && _.isObject(opts) ? _.pick(opts, _.keys(defaultOptions)) : {};
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
          object[key] = value && value >= 0 && value <= 100 ? value : defaultOptions[key];
          break;
        case 'threshold':
          value = _.isFinite(value) ? value : Number(value);
          object[key] = value && value >= 0 ? value : defaultOptions[key];
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
    let bytes = crypto.pseudoRandomBytes(32);
    let checksum = crypto.createHash('MD5').update(bytes).digest('hex');
    return checksum + '.' + this.options.output;
  };

  AvatarStorage.prototype._createOutputStream = function (filepath, cb) {
    let that = this;
    let output = fs.createWriteStream(filepath);

    output.on('error', cb);

    output.on('finish', function () {
      cb(null, {
        destination: that.uploadPath,
        baseUrl: that.uploadBaseUrl,
        filename: path.basename(filepath),
        storage: that.options.storage
      });
    });
    return output;
  };

  AvatarStorage.prototype._processImage = function (image, cb) {
    let that = this;
    let batch = [];
    let sizes = ['lg', 'md', 'sm'];
    let filename = this._generateRandomFilename();
    let mime = Jimp.MIME_PNG;
    let clone = image.clone();
    let width = clone.bitmap.width;
    let height = clone.bitmap.height;
    let square = Math.min(width, height);
    let threshold = this.options.threshold;

    switch (this.options.output) {
      case 'jpg':
        mime = Jimp.MIME_JPEG;
        break;
      case 'png':
      default:
        mime = Jimp.MIME_PNG;
        break;
    }
    if (threshold && square > threshold) {
      clone = square == width ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
    }
    if (this.options.square) {
      if (threshold) {
        square = Math.min(square, threshold);
      }
      clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
    }
    if (this.options.greyscale) {
      clone = clone.greyscale();
    }

    clone = clone.quality(this.options.quality);

    if (this.options.responsive) {

      batch = _.map(sizes, function (size) {

        let outputStream;
        let image = null;
        let filepath = filename.split('.');

        filepath = filepath[0] + '_' + size + '.' + filepath[1];
        filepath = path.join(that.uploadPath, filepath);
        outputStream = that._createOutputStream(filepath, cb);

        switch (size) {
          case 'sm':
            image = clone.clone().scale(0.3);
            break;
          case 'md':
            image = clone.clone().scale(0.7);
            break;
          case 'lg':
            image = clone.clone();
            break;
        }
        return {
          stream: outputStream,
          image: image
        };
      });

    } else {
      batch.push({
        stream: that._createOutputStream(path.join(that.uploadPath, filename), cb),
        image: clone
      });

    }

    _.each(batch, function (current) {
      current.image.getBuffer(mime, function (err, buffer) {
        if (that.options.storage === 'local') {
          streamifier.createReadStream(buffer).pipe(current.stream);
        }
      });
    });
  };

  AvatarStorage.prototype._handleFile = function (req, file, cb) {
    let that = this;

    let fileManipulate = concat(function (imageData) {

      Jimp.read(imageData)
        .then(function (image) {
          that._processImage(image, cb);
        })
        .catch(cb);
    });
    file.stream.pipe(fileManipulate);
  };

  AvatarStorage.prototype._removeFile = function (req, file, cb) {

    let matches, pathsplit;
    let filename = file.filename;
    let _path = path.join(this.uploadPath, filename);
    let paths = [];

    delete file.filename;
    delete file.destination;
    delete file.baseUrl;
    delete file.storage;

    if (this.options.responsive) {
      pathsplit = _path.split('/');
      matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

      if (matches) {
        paths = _.map(['lg', 'md', 'sm'], function (size) {
          return pathsplit.join('/') + '/' + (matches[1] + '_' + size + '.' + matches[2]);
        });
      }
    } else {
      paths = [_path];
    }
    _.each(paths, function (_path) {
      fs.unlink(_path, cb);
    });

  };

  return new AvatarStorage(options);
};

module.exports = AvatarStorage;