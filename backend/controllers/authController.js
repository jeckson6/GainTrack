const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // your mysql connection

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO Users (Email, PasswordHash)
    VALUES (?, ?)
  `;

  db.query(sql, [email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ message: 'User exists' });

    res.status(201).json({ message: 'User registered' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM Users WHERE Email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (results.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.UserID },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  });
};
