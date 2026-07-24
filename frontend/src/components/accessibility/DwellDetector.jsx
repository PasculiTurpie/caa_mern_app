import { useRef, useState, useCallback } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

/**
 * DwellDetector: implementa selección por "Tiempo de Morada" (Dwell Time),
 * pensado para usuarios de eye-tracking o puntero de cabeza sin capacidad
 * de "click" físico. Mantener el puntero/mirada sobre el elemento durante
 * `dwellTime` ms dispara la selección, con progreso visual circular.
 *
 * Uso: envuelve un elemento tarjeta con este componente (render props),
 * que expone `dwelling` (bool) y `progress` (0-100) para animar el indicador.
 */
export default function DwellDetector({ onSelect, children }) {
  const { dwellEnabled, dwellTime } = useAccessibility();
  const [dwelling, setDwelling] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const clearTimers = () => {
    clearTimeout(timeoutRef.current);
    cancelAnimationFrame(rafRef.current);
  };

  const animateProgress = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const pct = Math.min(100, (elapsed / dwellTime) * 100);
    setProgress(pct);
    if (pct < 100) {
      rafRef.current = requestAnimationFrame(animateProgress);
    }
  }, [dwellTime]);

  const handlePointerEnter = () => {
    if (!dwellEnabled) return;
    setDwelling(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animateProgress);
    timeoutRef.current = setTimeout(() => {
      onSelect?.();
      setDwelling(false);
      setProgress(0);
    }, dwellTime);
  };

  const handlePointerLeave = () => {
    if (!dwellEnabled) return;
    clearTimers();
    setDwelling(false);
    setProgress(0);
  };

  return children({
    dwelling,
    progress,
    handlers: dwellEnabled
      ? { onMouseEnter: handlePointerEnter, onMouseLeave: handlePointerLeave }
      : {},
  });
}
