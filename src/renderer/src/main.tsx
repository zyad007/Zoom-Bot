import './assets/main.css'
import ReactDOM from 'react-dom/client'
import AppRouter from './router/AppRouter'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <AppRouter/>
  </>
)
