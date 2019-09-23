const express = require('express');

const indexRouter = require('./index');
const esRouter = require('./es');
const esSubDomainRouter = require('./esSubdomain');
const groupSubDomainRouter = require('./groupSubdomain');
const candidateRouter = require('./candidate');
const boRouter = require('./backOffice');
const apiRouter = require('./api/api');
const apiUserRouter = require('./api/user');
const apiCandidateRouter = require('./api/candidate');
const apiBackOfficeRouter = require('./api/backOffice');
const apiEsRouter = require('./api/establishment');

const router = express.Router();

router.use('/', indexRouter);
router.use('/', candidateRouter);
router.use('/', esRouter);
router.use('/esDomain', esSubDomainRouter);
router.use('/groupDomain', groupSubDomainRouter);
router.use('/back-office', boRouter);
router.use('/api', apiRouter);
router.use('/api/user', apiUserRouter);
router.use('/api/candidate', apiCandidateRouter);
router.use('/api/back-office', apiBackOfficeRouter);
router.use('/api/es', apiEsRouter);

module.exports = router;

