const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ email, password });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error(" Error in registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
