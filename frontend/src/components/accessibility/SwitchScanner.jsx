import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

/**
 * SwitchScanner: implementa el "Escaneo Secuencial" (Switch Access) para
 * usuarios con movilidad reducida que usan uno o dos pulsadores adaptados.
 *
 * Recorre automáticamente los elementos seleccionables (`itemsCount`) resaltando
 * uno a la vez cada `scanSpeed` ms. El usuario presiona Espacio o Enter para
 * seleccionar el elemento actualmente resaltado.
 *
 * Este componente no renderiza UI propia: expone `activeIndex` mediante
 * render props (children como función) para que el componente padre
 * (ej. CardGrid) aplique el estilo `scanning` al elemento correspondiente.
 */
export default function SwitchScanner({ itemsCount, onSelect, children }) {
  const { scanningEnabled, scanSpeed } = useAccessibility();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  // Avanza el índice resaltado automáticamente mientras el escaneo está activo
  useEffect(() => {
    if (!scanningEnabled || itemsCount === 0) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemsCount);
    }, scanSpeed);

    return () => clearInterval(intervalRef.current);
  }, [scanningEnabled, scanSpeed, itemsCount]);

  // Escucha pulsadores adaptados: Espacio o Enter seleccionan el elemento activo
  useEffect(() => {
    if (!scanningEnabled) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onSelect?.(activeIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scanningEnabled, activeIndex, onSelect]);

  if (!scanningEnabled) return children({ activeIndex: -1 });

  return children({ activeIndex });
}
