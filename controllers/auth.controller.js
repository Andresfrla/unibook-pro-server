// Require the User model in order to interact with the database
const User = require("../models/User.model");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

const signupController = async (req, res, next) => {
  const { name, lastName, email, password, dateOfBirth, role } = req.body;

  // Check if email or password or name are provided as empty strings
  if (name === "" || lastName === "" || email === "" || password === "" || dateOfBirth === "") {
    res.status(400).json({ message: "El campo de nombre, apellido, email y password son requeridos" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "El formato del correo no es valido." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Tu contraseña debe tener 6 digitos, mayuculas, minusculas y numero.",
    });
    return;
  }

  try {
    // Check the users collection if a user with the same email already exists
    const user = await User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      saltRounds = 10;

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ name, lastName, email, password: hashedPassword, dateOfBirth, role});
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { name, lastName ,email , dateOfBirth, role, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { name, lastName ,email , dateOfBirth, role, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
  } catch (error){
    console.log(error)
    res.status(500).json({message: 'Internal server error'})
  }
}

const loginController = async (req, res, next) => {
      const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, role } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, role };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
}

const verifyController = async (req, res, next) => {
      // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
}

module.exports = {
    signupController,
    loginController,
    verifyController
}