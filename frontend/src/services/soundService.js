/**
 * Servicio de sonido: genera efectos cortos (como un "clic") usando la Web
 * Audio API directamente, sin depender de archivos de audio externos. Se
 * reutiliza un único AudioContext para toda la app (crear uno nuevo por
 * cada sonido es más costoso y algunos navegadores limitan cuántos se
 * pueden crear).
 */
let audioContext;

const getAudioContext = () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  // Algunos navegadores (sobre todo móviles) crean el contexto "suspendido"
  // hasta la primera interacción del usuario; como esto se llama justo
  // desde un clic/tap, se puede reanudar de forma segura aquí.
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

/**
 * Reproduce un "clic" breve y agudo, usado como confirmación auditiva al
 * seleccionar una tarjeta. Falla en silencio si el navegador bloquea el
 * audio (por ejemplo, si se llama fuera de una interacción del usuario).
 */
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);

    // Volumen bajo con caída rápida, para que suene como un "clic" corto
    // y no como un pitido molesto o sostenido.
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch {
    // Silencioso a propósito: el sonido es un extra, nunca debe romper la selección de tarjetas
  }
};
