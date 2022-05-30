import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/Register'
import About from './pages/About'
import ErrorPage from './pages/ErrorPage'
import LandingPage from './pages/LandingPage'
import Account from './pages/Account'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import './css/App.css';
import { useState } from 'react'
import ProtectedRoutes from './componets/ProtectedRoutes'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoutes />} >
            <Route exact path="/account" element={<Account />} />
          </Route>
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