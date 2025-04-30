const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, appointmentId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!amount || !paymentMethod || !appointmentId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify appointment exists and belongs to user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ error: 'Appointment is not in pending state' });
    }

    // Create payment
    const payment = new Payment({
      userId,
      appointmentId,
      amount,
      paymentMethod
    });

    await payment.save();

    // Update appointment status
    appointment.status = 'confirmed';
    await appointment.save();

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('appointmentId', 'date time service');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

module.exports = {
  processPayment,
  getPayments
};
