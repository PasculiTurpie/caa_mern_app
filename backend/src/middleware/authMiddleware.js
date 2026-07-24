import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware que protege rutas privadas verificando el token JWT
 * enviado en el header "Authorization: Bearer <token>".
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjunta el usuario (sin password) a la request para uso posterior
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado, token inválido' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
  }
};
