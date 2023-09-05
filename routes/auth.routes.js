const express = require("express");
const router = express.Router();
const { verifyController, 
        loginController, 
        signupController 
      } = require('../controllers/auth.controller')

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", signupController);

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", loginController);

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", verifyController);

module.exports = router;
