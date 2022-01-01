import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// Componets
import LandingPage from './pages/LandingPage.js'
// Pages
import Login from './pages/login.js'
import Register from './pages/register.js'
// CSS
import './css/App.css';


function App() {
  return (
  <div className='wrapper'>
    <LandingPage />
  </div>  
  )
}

export default App;