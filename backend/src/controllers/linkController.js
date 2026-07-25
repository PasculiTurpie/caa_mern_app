import crypto from 'crypto';
import User from '../models/User.js';

const INVITE_CODE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

// Genera un código legible de 6 caracteres (letras mayúsculas + números)
const generateCode = () =>
  crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);

/**
 * @desc    Genera (o renueva) un código de invitación para que otro usuario
 *          (tutor, terapeuta o paciente) se vincule con la cuenta actual.
 * @route   POST /api/links/invite-code
 * @access  Privado
 */
export const generateInviteCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.inviteCode = generateCode();
    user.inviteCodeExpires = new Date(Date.now() + INVITE_CODE_TTL_MS);
    await user.save();

    res.json({
      inviteCode: user.inviteCode,
      expiresAt: user.inviteCodeExpires,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Vincula al usuario autenticado con el dueño de un código de
 *          invitación válido. El vínculo es bidireccional: ambos quedan
 *          en el "equipo de cuidado" del otro.
 * @route   POST /api/links/connect
 * @access  Privado
 */
export const connectWithCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400);
      throw new Error('Debes ingresar un código de invitación');
    }

    const target = await User.findOne({ inviteCode: code.toUpperCase().trim() });

    if (!target || !target.inviteCodeExpires || target.inviteCodeExpires < new Date()) {
      res.status(400);
      throw new Error('El código de invitación no es válido o expiró');
    }

    if (target._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('No puedes vincularte contigo mismo');
    }

    const currentUser = await User.findById(req.user._id);

    const alreadyLinked = currentUser.linkedUsers.some(
      (id) => id.toString() === target._id.toString()
    );

    if (!alreadyLinked) {
      currentUser.linkedUsers.push(target._id);
      target.linkedUsers.push(currentUser._id);
      // El código se invalida tras usarse una vez para evitar vínculos accidentales
      target.inviteCode = null;
      target.inviteCodeExpires = null;
      await currentUser.save();
      await target.save();
    }

    res.json({
      message: `Ahora estás vinculado con ${target.name} (${target.role})`,
      linkedUser: { _id: target._id, name: target.name, role: target.role, email: target.email },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lista los usuarios vinculados al usuario autenticado
 *          (su equipo de cuidado: tutores, terapeutas y/o pacientes).
 * @route   GET /api/links
 * @access  Privado
 */
export const getLinkedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'linkedUsers',
      'name email role'
    );
    res.json(user.linkedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Elimina el vínculo (en ambos sentidos) con un usuario del equipo de cuidado.
 * @route   DELETE /api/links/:userId
 * @access  Privado
 */
export const removeLink = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(userId);

    currentUser.linkedUsers = currentUser.linkedUsers.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save();

    if (otherUser) {
      otherUser.linkedUsers = otherUser.linkedUsers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await otherUser.save();
    }

    res.json({ message: 'Vínculo eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
