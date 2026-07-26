import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

/**
 * SwitchScanner: implementa el "Escaneo Secuencial" (Switch Access) para
 * usuarios con movilidad reducida que usan uno o dos pulsadores adaptados.
 *
 * Recorre automáticamente los elementos seleccionables (`itemsCount`) resaltando
 * uno a la vez cada `scanSpeed` ms. El usuario selecciona el elemento
 * actualmente resaltado de tres formas equivalentes:
 * - Presionando Espacio o Enter (teclado físico, externo o en pantalla).
 * - Presionando cualquier botón de un joystick/control conectado por USB o
 *   Bluetooth (vía la API de Gamepad del navegador) — cubre la mayoría de
 *   pulsadores adaptados y controles genéricos que el sistema reconoce como
 *   "gamepad" en vez de emular directamente un teclado.
 *
 * Este componente no renderiza UI propia: expone `activeIndex` mediante
 * render props (children como función) para que el componente padre
 * (ej. CardGrid) aplique el estilo `scanning` al elemento correspondiente.
 */
export default function SwitchScanner({ itemsCount, onSelect, children }) {
  const { scanningEnabled, scanSpeed } = useAccessibility();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);

  // Mantiene una referencia siempre actualizada del índice activo, para que
  // el listener de gamepad (que corre en su propio bucle, no en cada render)
  // pueda leer el valor más reciente sin tener que reiniciarse constantemente.
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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

  // Escucha joysticks/controles conectados vía la API de Gamepad: al no
  // disparar eventos propios, hay que consultar su estado en un bucle
  // (requestAnimationFrame) y detectar cuándo un botón pasa de "suelto" a
  // "presionado". Cualquier botón de cualquier control conectado selecciona
  // el elemento resaltado actual.
  useEffect(() => {
    if (!scanningEnabled) return;
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return;

    let frameId;
    let wasAnyButtonPressed = false;

    const pollGamepads = () => {
      const gamepads = navigator.getGamepads();
      let isAnyButtonPressed = false;

      for (const gamepad of gamepads) {
        if (!gamepad) continue;
        if (gamepad.buttons.some((button) => button.pressed)) {
          isAnyButtonPressed = true;
          break;
        }
      }

      // Solo dispara en el flanco de "recién presionado", no mientras se
      // mantiene sostenido (para no seleccionar varias veces seguidas).
      if (isAnyButtonPressed && !wasAnyButtonPressed) {
        onSelect?.(activeIndexRef.current);
      }
      wasAnyButtonPressed = isAnyButtonPressed;

      frameId = requestAnimationFrame(pollGamepads);
    };

    frameId = requestAnimationFrame(pollGamepads);
    return () => cancelAnimationFrame(frameId);
  }, [scanningEnabled, onSelect]);

  if (!scanningEnabled) return children({ activeIndex: -1 });

  return children({ activeIndex });
}
