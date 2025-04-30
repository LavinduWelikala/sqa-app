const Appointment = require('../models/Appointment');
const User = require('../models/User');

const bookAppointment = async (req, res) => {
  try {
    const { date, time, service } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!date || !time || !service) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      userId,
      date,
      time,
      service
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your appointments' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  getMyAppointments,
  cancelAppointment
};
