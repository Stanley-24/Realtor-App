import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <App />
     <Toaster 
      position="top-center"   // or top-right, bottom-center, etc.
      richColors              // nice colored toasts (success green, error red)         
      duration={3000}  // auto-dismiss after 3
      toastOptions={{
        style: {
          background: "#028100",
          color: 'white',
          fontSize: '16px',
          fontFamily: "Arial, sans-serif",
        },
      }}
    />
    </BrowserRouter>
  </StrictMode>,
)
