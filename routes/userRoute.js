const express = require("express");
const router = express.Router();
const User = require("../Models/usermodel"); // Replace with the actual path to your User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { protect } = require("../utils/authMiddleware");

// Admin login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "please enter username and password" });
  }
  // Find the user by their username
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!result) {
          return res.status(401).json({ error: "Invalid password" });
        }

        // Authentication successful
        // Generate a JWT token
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1y" }
        );

        // Set the token as a cookie in the response with a 1-year expiration
        res.cookie("login_token", token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        });

        res.status(200).json({ message: "Sign in successful" ,token, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});
router.get('/', protect, async (req, res) => {
  try {

    const userId = req.user._id;

    // Fetch the user details from the database using the userId
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user details (excluding the password) in the response
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Admin signup route
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Check if user with the same username already exists
  User.findOne({ username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Generate a hash of the password using bcrypt
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }

        // Create a new user object
        const newUser = new User({ username, password: hashedPassword });

        // Save the new user to the database
        newUser
          .save()
          .then(() => {
            // Send a success response
            res.status(201).json({ message: "User created successfully" });
          })
          .catch((error) => {
            res
              .status(500)
              .json({ error: `Error saving user to the database ${error}` });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
