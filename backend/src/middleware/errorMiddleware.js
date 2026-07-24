/**
 * Middleware para rutas no encontradas (404).
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware centralizado de manejo de errores.
 * Captura errores lanzados en controladores (via next(error) o throw dentro de async handlers)
 * y responde con un formato JSON consistente.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Error de Mongoose: ObjectId con formato inválido
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  }

  // Error de Mongoose: validación de esquema
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Error de Mongoose: clave duplicada (ej. email ya registrado)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Ya existe un registro con ese valor único (ej. email)';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
