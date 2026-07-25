import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Modelo de Usuario.
 * Incluye preferencias de accesibilidad para que la configuración
 * (velocidad de escaneo, tiempo de morada, tema, velocidad de voz)
 * persista entre sesiones y dispositivos del usuario.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: 6,
      select: false, // nunca se devuelve por defecto en consultas
    },
    role: {
      type: String,
      enum: ['paciente', 'tutor', 'terapeuta'],
      default: 'paciente',
    },
    // "Equipo de cuidado": vínculo bidireccional entre un paciente y sus
    // tutores/terapeutas (o entre varios profesionales de un mismo paciente).
    // Se usa tanto para decidir qué tarjetas privadas puede VER un usuario
    // como para decidir quién puede EDITAR/ELIMINAR tarjetas ajenas.
    linkedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Código temporal que este usuario puede compartir para que otro
    // (tutor, terapeuta o paciente) se vincule con él desde /api/links/connect.
    inviteCode: {
      type: String,
      default: null,
    },
    inviteCodeExpires: {
      type: Date,
      default: null,
    },
    accessibilityPreferences: {
      scanSpeed: {
        type: Number, // milisegundos entre resaltados en el escaneo secuencial
        default: 1500,
        min: 300,
      },
      dwellTime: {
        type: Number, // milisegundos para activar selección por Dwell (eye-tracking)
        default: 1200,
        min: 300,
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'high-contrast'],
        default: 'light',
      },
      voiceRate: {
        type: Number, // velocidad de síntesis de voz (0.5 - 2)
        default: 1,
        min: 0.5,
        max: 2,
      },
      voicePitch: {
        type: Number, // tono de la voz (0 - 2)
        default: 1,
        min: 0,
        max: 2,
      },
      preferredVoiceURI: {
        type: String,
        default: '',
      },
      scanningEnabled: {
        type: Boolean,
        default: false,
      },
      dwellEnabled: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// Hash de la contraseña antes de guardar, solo si fue modificada.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compara una contraseña en texto plano con el hash almacenado.
userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
