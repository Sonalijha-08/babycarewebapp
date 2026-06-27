const { body, param, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed. ' + errors.array().map(e => e.msg).join(', '), 
      errors: errors.array() 
    });
  }
  return null;
};

// Diaper Log Add
const validateDiaperAdd = [
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time (HH:MM) required'),
  body('type').isIn(['Wet', 'Dirty', 'Both']).withMessage('Type must be Wet, Dirty, or Both'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 chars'),
  body('setReminder').optional().isBoolean(),
  body('reminderMinutes').optional().isInt({ min: 1, max: 1440 }).withMessage('Reminder minutes 1-1440'),
  body('reminderIntervalMinutes').optional().isInt({ min: 1, max: 1440 }),
  body('reminderRepeatLimit').optional().isInt({ min: 1, max: 1000 })
];

// Growth Tracker Add
const validateGrowthAdd = [
  // Optional userId (allow client to send, otherwise use JWT user id)
  body('userId').optional().isMongoId().withMessage('Invalid userId'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('weight').toFloat().isFloat({ min: 0.1 }).withMessage('Weight > 0.1 kg'),
  body('height').toFloat().isFloat({ min: 10 }).withMessage('Height > 10 cm'),
  body('headCircumference').optional().isFloat({ min: 10 }).withMessage('Head circumference > 10'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 chars')
];

// Sleep Log Add
const validateSleepAdd = [
  body('date').isISO8601().withMessage('Valid date required'),
  body('sleepTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid sleep time required'),
  body('wakeTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid wake time required'),
  body('duration').isLength({ min: 1 }).withMessage('Duration required'),
  body('notes').optional().isLength({ max: 500 })
];

// Feeding Add
const validateFeedingAdd = [
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time required'),
  body('type').notEmpty().withMessage('Type required'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount >= 0'),
  body('duration').optional(),
  body('side').optional(),
  body('notes').optional().isLength({ max: 500 }),
  body('setReminder').optional().isBoolean(),
  body('reminderMinutes').optional().isInt({ min: 1, max: 1440 })
];

// Vaccinations Add
const validateVaccinationAdd = [
  body('date').isISO8601().withMessage('Valid date required'),
  body('vaccineName').notEmpty().isLength({ max: 100 }).withMessage('Vaccine name required, max 100 chars'),
  body('amount').optional().isFloat({ min: 0 }),
  body('duration').optional(),
  body('side').optional(),
  body('nextVaccinationDate').optional().isISO8601(),
  body('notes').optional().isLength({ max: 500 }),
  body('reminderEnabled').optional().isBoolean()
];

// Auth Register
const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  // DO NOT use normalizeEmail() — it mutates the email and causes login mismatches
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Auth Login
const validateLogin = [
  // DO NOT use normalizeEmail() — must match exactly what was stored at registration
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// Profile Update
const validateProfileUpdate = [
  body('name').isLength({ min: 2, max: 50 }).withMessage('Name 2-50 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().matches(/^[+]?[0-9]{10,15}$/).withMessage('Valid phone'),
  body('babyName').optional().isLength({ max: 50 }),
  body('babyDOB').optional().isISO8601()
];

// ID param (for delete/update)
const validateIdParam = [
  param('id').custom((value) => isValidObjectId(value)).withMessage('Valid ID required')
];

module.exports = {
  sendValidationErrors,
  validateDiaperAdd,
  validateGrowthAdd,
  validateSleepAdd,
  validateFeedingAdd,
  validateVaccinationAdd,
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateIdParam
};
