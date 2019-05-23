const _ = require('lodash');
const httpsStatus = require('http-status');
const { BackError } = require(`../helpers/back.error`);
const Models = require('../orm/models');
const Authentication = {};

/**
 * ensureIsNotAuthenticated MiddleWare
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @description Ensure that the current user is logged-out
 */
Authentication.ensureIsNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Vous êtes déjà connecté.');
    res.redirect('/');
  }
};

/**
 * ensureAuthenticated MiddleWare
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @description Ensure that the current user is logged-in
 */
Authentication.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Vous n\'êtes pas connecté.');
    res.redirect('/');
  }
};

/**
 * ensureIsAdmin MiddleWare
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @description Ensure that the current user is an admin
 */
Authentication.ensureIsAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (['Admin'].includes(req.user.role) || ['Admin'].includes(req.session.role)) {
      next();
    } else {
      return next(new BackError('Vous n\'avez pas accès à cette page.', httpsStatus.FORBIDDEN));
    }
  } else {
    return next(new BackError('Vous devez être connecté.', httpsStatus.FORBIDDEN));
  }
};

/**
 * ensureIsCandidate MiddleWare
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @description Ensure that the current user is a candidate
 */
Authentication.ensureIsCandidate = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (['candidate'].includes(req.user.type)) {
      next();
    } else {
      return next(new BackError('Vous n\'avez pas accès à cette page.', httpsStatus.FORBIDDEN));
    }
  } else {
    return next(new BackError('Vous devez être connecté.', httpsStatus.FORBIDDEN));
  }
};

/**
 * ensureIsEs MiddleWare
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @description Ensure that the current user is an es
 */
Authentication.ensureIsEs = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (['es'].includes(req.user.type)) {
      if ((_.isNil(req.user.opts) || !('currentEs' in req.user.opts)) && req.url.search('/select/es') === -1) return res.redirect('/select/es');
      next();
    } else {
      return next(new BackError('Vous n\'avez pas accès à cette page.', httpsStatus.FORBIDDEN));
    }
  } else {
    return next(new BackError('Vous devez être connecté.', httpsStatus.FORBIDDEN));
  }
};

/**
 * Authentication middleware
 * @param req
 * @param res
 * @param next
 * @description ensure that the current user belongs to the establishment call in the route.
 */
Authentication.verifyEsAccess = (req, res, next) => {
  Models.Establishment.findOne({
    where: { id: req.params.esId || req.user.opts.currentEs },
    include: {
      model: Models.ESAccount,
      where: { user_id: req.user.id }
    }
  }).then(es => {
    if (!es) return res.status(403).send(`You don't have access to this establishment.`);
    req.es = es;
    next();
  });
};

module.exports = Authentication;