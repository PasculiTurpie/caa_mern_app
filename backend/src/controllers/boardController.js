import Board from '../models/Board.js';

/**
 * @desc    Obtener todos los tableros del usuario autenticado
 * @route   GET /api/boards
 * @access  Privado
 */
export const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ owner: req.user._id })
      .populate('cards')
      .sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un tablero por id (con sus tarjetas pobladas)
 * @route   GET /api/boards/:id
 * @access  Privado
 */
export const getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id).populate('cards');

    if (!board) {
      res.status(404);
      throw new Error('Tablero no encontrado');
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('No tienes permiso para ver este tablero');
    }

    res.json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear un nuevo tablero
 * @route   POST /api/boards
 * @access  Privado
 */
export const createBoard = async (req, res, next) => {
  try {
    const { title, cards } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('El título del tablero es obligatorio');
    }

    const board = await Board.create({
      title,
      owner: req.user._id,
      cards: cards || [],
    });

    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un tablero (título y/o lista de tarjetas)
 * @route   PUT /api/boards/:id
 * @access  Privado
 */
export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404);
      throw new Error('Tablero no encontrado');
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('No tienes permiso para editar este tablero');
    }

    if (req.body.title !== undefined) board.title = req.body.title;
    if (req.body.cards !== undefined) board.cards = req.body.cards;

    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Añadir una tarjeta existente a un tablero
 * @route   PUT /api/boards/:id/add-card/:cardId
 * @access  Privado
 */
export const addCardToBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404);
      throw new Error('Tablero no encontrado');
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('No tienes permiso para editar este tablero');
    }

    if (!board.cards.includes(req.params.cardId)) {
      board.cards.push(req.params.cardId);
      await board.save();
    }

    const populated = await board.populate('cards');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un tablero
 * @route   DELETE /api/boards/:id
 * @access  Privado
 */
export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404);
      throw new Error('Tablero no encontrado');
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('No tienes permiso para eliminar este tablero');
    }

    await board.deleteOne();
    res.json({ message: 'Tablero eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
