import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (including user id) to request
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default auth;
