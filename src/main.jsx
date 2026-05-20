import { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ListProvider } from './context/ListContext'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faUserPen, faUser, faQuestion, faCircleCheck, faCircleInfo, faAngleDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'

library.add(faPencil, faUserPen, faUser, faQuestion, faCircleCheck, faCircleInfo, faAngleDown, faArrowRight)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListProvider>
      <Router>
        <App />
      </Router>
    </ListProvider>
  </StrictMode>,
)
