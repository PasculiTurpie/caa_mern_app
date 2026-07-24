import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SpeechProvider } from './context/SpeechContext.jsx';
import './index.css';

// Orden de providers: Accessibility primero (Auth depende de él para cargar
// las preferencias del usuario al iniciar sesión).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <SpeechProvider>
            <App />
          </SpeechProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>
);
