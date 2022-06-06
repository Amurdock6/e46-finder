import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import Logout from './pages/Logout'
import Login from './pages/login'
import Register from './pages/register'
import About from './pages/About'
import ErrorPage from './pages/ErrorPage'
import LandingPage from './pages/LandingPage'
import Account from './pages/Account'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import './css/App.css';
import { useEffect, useState } from 'react'
import ProtectedRoutes from './componets/ProtectedRoutes'
import ReactGA from 'react-ga';


function App() {
  useEffect (() => {
    ReactGA.initialize('G-X1RJGE867Q');

    // Reports page views
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoutes />} >
            <Route exact path="/account" element={<Account />} />
          </Route>
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:reset_id" element={<ResetPassword />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;