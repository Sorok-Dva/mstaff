const httpStatus = require('http-status');
const statuses = require('statuses');
const { BackError } = require('../helpers/back.error');
const { Env } = require('../helpers/helpers');

const debug = require('debug')('error'); // eslint-disable-line no-unused-vars

const getStatus = (err) => {
  // if (err.code === MULTER_ERROR_CODE_MAX_FILE_UPLOAD) return httpStatus.REQUEST_ENTITY_TOO_LARGE;
  return err.status;
};

const sendError = (req, res, status, err) => {
  if (res.headersSent) return;
  err.status = status;
  if (Env.current === 'production' || Env.current === 'pre-prod') delete err.stack;
  if (req.xhr) return res.status(status).json(err);
  else return res.status(status).render('error', { error: err });
};

module.exports = {
  getStatus,
  client: (err, req, res, next) => {
    if (err.errorCode && err.name && err.message) {
      sendError(req, res, err.errorCode, { name: err.name, message: err.message });
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
  notFoundError: (req, res, next) => next(new BackError('Not Found', httpStatus.NOT_FOUND)),
  /*  sentrySenderErrorHandler: (err, req, res, next) => {
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
    Sentry.send(err, context);

    next(err);
  },*/
  api: (err, req, res, next) => { // eslint-disable-line no-unused-vars
    let status = err.status || err.statusCode || 500;
    if (status < 400) status = 500;

    if (err instanceof BackError && status >= 500) return sendError(req, res, status, err);

    const body = { status };

    // show the stacktrace when not in production
    if (Env.current !== 'production' && 'pre-prod') {
      body.stack = err.stack;
    }
    // internal server errors
    if (status >= 500) {
      body.message = statuses[status];
      return sendError(req, res, status, body);
    }

    // client errors
    body.message = err.message;

    if (err.code) body.code = err.code;
    if (err.name) body.name = err.name;
    if (err.type) body.type = err.type;
    if (err.errors) body.errors = err.errors;

    return sendError(req, res, status, body);
  }
};