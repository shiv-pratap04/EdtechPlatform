// Import the required modules
const express = require("express")
const router = express.Router()

const { testManualEnrollment } = require("../controllers/testEnroll");
const { auth } = require("../middlewares/auth"); // optional

// POST /api/v1/payment/testEnroll
router.post("/testEnroll", auth, testManualEnrollment); // or remove `auth` if testing publicly


const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router