import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORY_LIST, getCategoryStyles } from '../../utils/fitzgeraldColors';

/**
 * AddCardModal: formulario accesible para crear una tarjeta nueva o editar
 * una existente. Si se recibe `initialCard`, el formulario se precarga con
 * sus datos y opera en modo edición (título y botón cambian en consecuencia).
 * Se cierra con Escape y usa `role="dialog"` para el diálogo modal.
 */
export default function AddCardModal({ isOpen, onClose, onSubmit, initialCard = null }) {
  const isEditMode = Boolean(initialCard);

  const [text, setText] = useState('');
  const [category, setCategory] = useState(CATEGORY_LIST[0]);
  const [emoji, setEmoji] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // Cada vez que se abre el modal, precarga los datos de la tarjeta a editar
  // (o resetea el formulario si es una tarjeta nueva).
  useEffect(() => {
    if (!isOpen) return;
    if (initialCard) {
      setText(initialCard.text || '');
      setCategory(initialCard.category || CATEGORY_LIST[0]);
      setEmoji(initialCard.emoji || '');
      setImageUrl(initialCard.imageUrl || '');
      setIsPublic(Boolean(initialCard.isPublic));
    } else {
      setText('');
      setCategory(CATEGORY_LIST[0]);
      setEmoji('');
      setImageUrl('');
      setIsPublic(false);
    }
  }, [isOpen, initialCard]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), category, emoji, imageUrl, isPublic });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-card-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="add-card-title" className="text-xl font-bold">
            {isEditMode ? 'Editar tarjeta' : 'Añadir nueva tarjeta'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Texto de la tarjeta</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="rounded-lg border-2 border-gray-300 p-2"
              placeholder="Ej: Quiero agua"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-semibold">Categoría</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LIST.map((cat) => {
                const styles = getCategoryStyles(cat);
                return (
                  <label
                    key={cat}
                    className={`cursor-pointer rounded-full border-2 px-3 py-1.5 text-sm font-semibold ${
                      styles.bg
                    } ${styles.text} ${
                      category === cat ? 'ring-2 ring-offset-1 ring-blue-600' : ''
                    } ${styles.border}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="sr-only"
                    />
                    {styles.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Emoji (opcional)</span>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={4}
              className="w-24 rounded-lg border-2 border-gray-300 p-2 text-2xl"
              placeholder="💧"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">URL de imagen personalizada (opcional)</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-lg border-2 border-gray-300 p-2"
              placeholder="https://..."
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-5 w-5"
            />
            <span>Hacer esta tarjeta pública (visible para otros usuarios)</span>
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-4 py-2 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"
            >
              {isEditMode ? 'Guardar cambios' : 'Guardar tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
