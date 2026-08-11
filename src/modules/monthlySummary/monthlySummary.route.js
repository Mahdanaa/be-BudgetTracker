const express = require('express');
const router = express.Router();
const MonthlySummaryController = require('./monthlySummary.controller');
const authJWT = require('../../middlewares/auth.middleware');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const validateRequest = require('../../middlewares/validation.middleware');
const {
  createMonthlySummaryValidator,
  updateMonthlySummaryValidator,
  idParamValidator,
} = require('./monthlySummary.validator');

router.use(authJWT);
router.get('/', asyncErrorHandler(MonthlySummaryController.getAll.bind(MonthlySummaryController)));
router.get(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(MonthlySummaryController.getById.bind(MonthlySummaryController))
);
router.post(
  '/',
  createMonthlySummaryValidator,
  validateRequest,
  asyncErrorHandler(MonthlySummaryController.create.bind(MonthlySummaryController))
);
router.put(
  '/:id',
  idParamValidator,
  validateRequest,
  updateMonthlySummaryValidator,
  asyncErrorHandler(MonthlySummaryController.update.bind(MonthlySummaryController))
);
router.delete(
  '/:id',
  idParamValidator,
  validateRequest,
  asyncErrorHandler(MonthlySummaryController.delete.bind(MonthlySummaryController))
);

module.exports = router;
