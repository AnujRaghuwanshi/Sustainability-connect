const express = require('express');
const { register , login, getAllUsers} = require('../controllers/userController');
const router = express.Router();

// User registration route
router.post('/register', register);

router.post('/login', login)

router.get('/allUsers', getAllUsers);

module.exports = router;
