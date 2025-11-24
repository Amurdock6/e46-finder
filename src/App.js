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
import ProtectedRoutes from './componets/ProtectedRoutes'
import Confirmation from './pages/confirmation'
import Deleted from './pages/Deleted'
import AccountDeleted from './pages/accountdeleted'
import CreateListing from './pages/CreateListing'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoutes />} >
            <Route exact path="/account" element={<Account />} />
            <Route exact path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/Logout" element={<Logout />} />
          <Route path="/deleted" element={<Deleted />} />
          <Route path="/accountdeleted" element={<AccountDeleted />} />
          <Route path="/confirmation" element={<Confirmation />} />
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
