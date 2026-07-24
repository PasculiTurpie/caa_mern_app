import Card from '../models/Card.js';

/**
 * @desc    Obtener tarjetas del usuario (propias + públicas), con filtro opcional de categoría
 * @route   GET /api/cards?category=accion
 * @access  Privado
 */
export const getCards = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = {
      $or: [{ creator: req.user._id }, { isPublic: true }],
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
 * @desc    Actualizar una tarjeta existente (solo su creador)
 * @route   PUT /api/cards/:id
 * @access  Privado
 */
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(404);
      throw new Error('Tarjeta no encontrada');
    }

    if (card.creator.toString() !== req.user._id.toString()) {
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
 * @desc    Eliminar una tarjeta (solo su creador)
 * @route   DELETE /api/cards/:id
 * @access  Privado
 */
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      res.status(404);
      throw new Error('Tarjeta no encontrada');
    }

    if (card.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('No tienes permiso para eliminar esta tarjeta');
    }

    await card.deleteOne();
    res.json({ message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
