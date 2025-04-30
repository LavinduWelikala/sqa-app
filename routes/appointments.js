const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, getMyAppointments, cancelAppointment } = require('../controllers/appointmentController');

router.route('/').get(getAppointments).post(bookAppointment);
router.route('/my').get(getMyAppointments);
router.route('/:id/cancel').put(cancelAppointment);

module.exports = router;
