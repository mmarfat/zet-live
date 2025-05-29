import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/map.css'
import './index.css'
import App from './App.jsx'
import './i18n';
import '@fontsource-variable/inter';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from '@/theme/theme-provider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
