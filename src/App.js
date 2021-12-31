import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// Componets
import Slideshow from './componets/Slideshow.js'
import Header from './componets/Header.js'
// Pages
import Login from './pages/login.js'
import Register from './pages/register.js'
// CSS
import './css/App.css';
import './css/Home.css';

function App() {
  return (
  <div className='wrapper'>
    <Header />
    {/* <Slideshow /> */}
  </div>  
  )
}

export default App;