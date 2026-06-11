const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }
    const token = jwt.sign({ email, tier: 'free' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { email, tier: 'free', createdAt: new Date().toISOString() }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    const token = jwt.sign({ email, tier: 'free' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { email, tier: 'free' }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/upgrade', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Authorization required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign({ email: decoded.email, tier: 'pro' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      success: true,
      token: newToken,
      user: { email: decoded.email, tier: 'pro' }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
