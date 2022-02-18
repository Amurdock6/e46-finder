import axios from 'axios'
import { Outlet, Navigate } from "react-router";

let auth = false

axios.get('http://localhost:5000/auth', { withCredentials: true }).then((res) => {
        auth = ''
        // figure out how to set auth equal to true based on the middleWare auth on the backend
    });
const useAuth = () => {
    const authorized = {loggedIn: false}
    return authorized && authorized.loggedIn;
}

const ProtectedRoutes = () => {
        const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes
