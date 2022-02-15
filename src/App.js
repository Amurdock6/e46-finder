import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import ErrorPage from './pages/ErrorPage'
import LandingPage from './pages/LandingPage'
import Account from './pages/Account'
// CSS
import './css/App.css';
import { useState } from 'react/cjs/react.development'
import ProtectedRoutes from './componets/ProtectedRoutes'


function App() {
  return(
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectedRoutes />} >
          <Route exact path="/account" element={<Account />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
    </>
)
}

export default App;