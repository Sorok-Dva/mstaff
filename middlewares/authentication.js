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
    req.flash('error_msg', 'You are not logged');
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
      res.redirect('/');
    }
  } else {
    res.redirect('/');
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
      res.redirect('/');
    }
  } else {
    res.redirect('/');
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
      next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
};