const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  company: user.company || "",
  address: user.address || "",
  createdAt: user.createdAt,
});

const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone, company, address } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      phone: phone || "",
      company: company || "",
      address: address || "",
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: formatUserResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile", error: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existing) return res.status(400).json({ message: "Email already registered" });
      user.email = email.toLowerCase();
    }

    if (typeof name === "string") user.name = name.trim();
    if (typeof phone === "string") user.phone = phone.trim();
    if (typeof company === "string") user.company = company.trim();
    if (typeof address === "string") user.address = address.trim();

    await user.save();
    return res.json({ message: "Profile updated successfully", user: formatUserResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

module.exports = { signup, login, getMe, updateMe };
