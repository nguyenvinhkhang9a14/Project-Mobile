const db = require("../Models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, role, firstname, lastname } = req.body;
    
    const existingUser = await db.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({ 
      email, 
      password: hashedPassword, 
      role,
      firstname,
      lastname
    });
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user.userId, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || "jwt_secret", 
      { expiresIn: "24h" }
    );
    
    res.status(200).json({ 
      token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
