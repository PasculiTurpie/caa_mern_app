import Card from '../models/Card.js';

/**
 * Determina si `user` puede editar/eliminar `card`:
 * - Siempre puede si es su propia tarjeta.
 * - Un paciente NUNCA puede editar/eliminar tarjetas creadas por otra
 *   persona (aunque sean de su tutor/terapeuta vinculado): solo administra
 *   las suyas propias.
 * - Un tutor/terapeuta puede editar/eliminar tarjetas creadas por cualquier
 *   usuario de su "equipo de cuidado" (vinculado mediante código de invitación),
 *   lo que incluye las de su paciente y las de otros profesionales vinculados
 *   al mismo paciente.
 */
const canManageCard = (user, card) => {
  const isOwner = card.creator.toString() === user._id.toString();
  if (isOwner) return true;
  if (user.role === 'paciente') return false;

  return (user.linkedUsers || []).some((id) => id.toString() === card.creator.toString());
};

/**
 * @desc    Obtener tarjetas visibles para el usuario: las propias, las
 *          públicas (biblioteca general, ej. tarjetas del sistema) y las
 *          creadas por cualquier miembro de su equipo de cuidado vinculado
 *          (sean públicas o privadas), con filtro opcional de categoría.
 * @route   GET /api/cards?category=accion
 * @access  Privado
 */
export const getCards = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = {
      $or: [
        { creator: req.user._id },
        { isPublic: true },
        { creator: { $in: req.user.linkedUsers || [] } },
      ],
    };

    if (category) filter.category = category;

    const cards = await Card.find(filter).sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener una tarjeta por id
 * @route   GET /api/cards/:id
 * @access  Privado
 */
export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      res.status(404);
      throw new Error('Tarjeta no encontrada');
    }
    res.json(card);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear una nueva tarjeta personalizada
 * @route   POST /api/cards
 * @access  Privado
 */
export const createCard = async (req, res, next) => {
  try {
    const { text, category, emoji, imageUrl, isPublic } = req.body;

    if (!text || !category) {
      res.status(400);
      throw new Error('El texto y la categoría son obligatorios');
    }

    const card = await Card.create({
      text,
      category,
      emoji,
      imageUrl,
      isPublic: Boolean(isPublic),
      creator: req.user._id,
    });

    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar una tarjeta existente
 * @route   PUT /api/cards/:id
 * @access  Privado (el creador, o un tutor/terapeuta de su equipo de cuidado
 *          vinculado; un paciente solo puede editar sus propias tarjetas)
 */
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(404);
      throw new Error('Tarjeta no encontrada');
    }

    if (!canManageCard(req.user, card)) {
      res.status(403);
      throw new Error('No tienes permiso para editar esta tarjeta');
    }

    Object.assign(card, req.body);
    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar una tarjeta
 * @route   DELETE /api/cards/:id
 * @access  Privado (el creador, o un tutor/terapeuta de su equipo de cuidado
 *          vinculado; un paciente solo puede eliminar sus propias tarjetas)
 */
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(404);
      throw new Error('Tarjeta no encontrada');
    }

    if (!canManageCard(req.user, card)) {
      res.status(403);
      throw new Error('No tienes permiso para eliminar esta tarjeta');
    }

    await card.deleteOne();
    res.json({ message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
