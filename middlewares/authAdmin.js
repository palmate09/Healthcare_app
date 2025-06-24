import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token not found' }); 
    }

    const token = authHeader.split(' ')[1];

    var decoded = jwt.verify(token, process.env.JWT_SECRECT);

    req.body.email = decoded.email;

    next(); 
  } catch (err) {
    return res.status(500).json({error: err.message,  message: 'Invalid token' }); 
  }
};