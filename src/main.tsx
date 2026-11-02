import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { STILL, Still } from './Still'
import './styles.css'

if (window.location.hash.includes('figmacapture=')) {
  const script = document.createElement('script')
  script.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js'
  script.async = true
  document.head.appendChild(script)
}

createRoot(document.getElementById('root')!).render(<StrictMode>{STILL ? <Still spec={STILL} /> : <App />}</StrictMode>)
