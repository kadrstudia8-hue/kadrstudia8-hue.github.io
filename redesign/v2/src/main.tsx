import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/onest/index.css'
import '@fontsource-variable/caveat/index.css'
import '@fontsource-variable/pixelify-sans/index.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
