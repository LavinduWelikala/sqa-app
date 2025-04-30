const express = require('express');
const router = express.Router();
const { processPayment, getPayments } = require('../controllers/paymentController');

router.route('/').get(getPayments).post(processPayment);

module.exports = router;
