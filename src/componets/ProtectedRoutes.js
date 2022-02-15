import { Outlet, Navigate } from "react-router";

const useAuth = () => {
    const user = {loggedIn: false}
    return user && user.loggedIn;
}

const ProtectedRoutes = () => {
        const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes
