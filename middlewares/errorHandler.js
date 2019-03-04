const httpStatus = require('http-status');
const statuses = require('statuses');
const { BackError } = require('../helpers/back.error');
const { Env } = require('../helpers/helpers');

const debug = require('debug')('error'); // eslint-disable-line no-unused-vars

const getStatus = (err) => {
  // if (err.code === MULTER_ERROR_CODE_MAX_FILE_UPLOAD) return httpStatus.REQUEST_ENTITY_TOO_LARGE;
  return err.status;
};

module.exports = {
  getStatus,
  client: (err, req, res, next) => {
    if (err.errorCode && err.name && err.message) {
      res.status(err.errorCode).send({ name: err.name, message: err.message });
    }
    next(err);
  },
  converter: (err, req, res, next) => {
    if (!(err instanceof BackError)) {
      return next(new BackError(err.message, getStatus(err), err));
    }
    return next(err);
  },
  log: (err, req, res, next) => {
    debug(err);
    if ('errors' in err) {
      debug(err.errors);
    }
    if ('stack' in err) {
      debug(err.stack);
    }
    next(err);
  },
  sentrySenderErrorHandler: (err, req, res, next) => {
    let status = err.status || err.statusCode || 500;
    if (status < 400) status = 500;

    const context = {
      user: {
        method: req.method,
        id: req.user && req.user.id,
        url: req.originalUrl,
      },
      extra: err.extraContextForSentry,
    };
    // Sentry.send(err, context);

    next(err);
  },
  api: (err, req, res, next) => { // eslint-disable-line no-unused-vars
    let status = err.status || err.statusCode || 500;
    if (status < 400) status = 500;

    if (err instanceof BackError && status >= 500) return res.status(status).json(err);

    const body = { status };

    // show the stacktrace when not in production
    if (Env.current !== 'production') {
      body.stack = err.stack;
      debug(err.stack);
    }
    // internal server errors
    if (status >= 500) {
      body.message = statuses[status];
      return res.status(status).json(body);
    }

    // client errors
    body.message = err.message;

    if (err.code) body.code = err.code;
    if (err.name) body.name = err.name;
    if (err.type) body.type = err.type;
    if (err.errors) body.errors = err.errors;

    return res.status(status).render('error', { error: body });
  }
};