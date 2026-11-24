import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyToDocument, getLang } from '@kadr/shared/i18n'
import './index.css'
import App from './App'

applyToDocument(getLang())
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
