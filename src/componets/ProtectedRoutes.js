import axios from 'axios'
import { Outlet, Navigate } from "react-router";

// axios.post('http://localhost:5000/middleware/protectedroutes', {
//     cookieValue: cookieValue
// }).then(sendValue => {
//     return axios.get('http://localhost:5000/auth', { withCredentials: true }).then((res) => {
//         // console.log(res.data)
//     })
// });

const useAuth = () => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth='))
        .split('=')[1];

    if ( cookieValue === 'true') {
        const authorized = {loggedIn: true}
        return authorized && authorized.loggedIn;
    } else {
        const authorized = {loggedIn: false}
        return authorized && authorized.loggedIn;
    }
};

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes

// Need to assign the auth cookie with the user on login as well as the user id and send it with the httpOnly token on login/registration
// Then keep this page as is just change up the value of auth to be a random string so instead of true or false make it a ran string val 
// That i will first send to the front end from backend when logedin/registration
// Then send it to backend to verify that value is correct and not something a user added
// this should make protected route more secure