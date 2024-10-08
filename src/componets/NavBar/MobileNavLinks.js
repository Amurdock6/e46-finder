import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import './NavLinks.css'

const clientId = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual Google Client ID

const MobileNavLinks = (props) => {
    let navigate = useNavigate();

    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin === -1) {
            begin = dc.indexOf(prefix);
            if (begin !== 0) return null;
        }
        else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end === -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    // Logs out the current user
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:5000/googlelogout', {
                withCredentials: true,
            });
            googleLogout(); // Logs the user out from Google
            alert("Successfully logged out");
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    // Redirect to confirmation page to delete users account
    const deleteAccount = async () => {
        navigate('/deleted');
    };

    var loggedInCookie = getCookie("LoggedIn");

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                {loggedInCookie == null ? (
                    <>
                        <Link to='/about'>
                            <h3>About</h3>
                        </Link>
                        <Link to="/login">
                            <h3>Login</h3>
                        </Link>
                        <Link to="/register">
                            <h3>Sign Up</h3>
                        </Link>
                        <div className="menu-background"></div>
                    </>
                ) : (
                    <>
                        <Link to='/about'>
                            <h3>About</h3>
                        </Link>
                        <Link to="/account">
                            <h3>View Account</h3>
                        </Link>
                        <button id="logout" onClick={handleLogout}>Log Out</button>
                        <button onClick={deleteAccount} id="delete"><p>Delete Account</p></button>
                        <div className="menu-background"></div>
                    </>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default MobileNavLinks;