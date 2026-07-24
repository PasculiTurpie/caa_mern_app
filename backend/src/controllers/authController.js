import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Genera un JWT firmado con el id del usuario
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Por favor completa nombre, email y contraseña');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Ya existe un usuario con ese email');
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessibilityPreferences: user.accessibilityPreferences,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Autenticar usuario y obtener token
 * @route   POST /api/auth/login
 * @access  Público
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Se solicita explícitamente el password ya que el esquema lo excluye por defecto
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Email o contraseña incorrectos');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessibilityPreferences: user.accessibilityPreferences,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener el perfil del usuario autenticado
 * @route   GET /api/auth/profile
 * @access  Privado
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user fue adjuntado por el middleware "protect"
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar preferencias de accesibilidad del usuario
 * @route   PUT /api/auth/preferences
 * @access  Privado
 */
export const updateAccessibilityPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    user.accessibilityPreferences = {
      ...user.accessibilityPreferences.toObject(),
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json(updatedUser.accessibilityPreferences);
  } catch (error) {
    next(error);
  }
};
