import Logo from '../../logos-icons/e46-logo.jpg'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const NavLinks = () => {
    let navigate = useNavigate();

    // Checks for Logged-In Cookie
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

    // Logic that sets links in nav based off of the result of the function getCookie(name)
    var loggedInCookie = getCookie("LoggedIn");

    if (loggedInCookie == null) {
        console.log('Usser is not logged in')
        
    }
    else {
        console.log('Usser is logged in')
    }

    // Logsout current user
    const onSuccess = async () => {
        try {
            await axios.get('http://localhost:5000/googlelogout', {
            withCredentials: true
        });
        
          } catch (error) {
            console.log(error);
          };
          navigate('/');
      };
 

    return (

        <>
            <div id="left-nav">
                <Link to='/about'>
                    <h3>About</h3>
                </Link>
            </div>
            <div id="middle-nav">
                <Link to="/">
                    <img src={Logo} alt='E46 Logo' />
                </Link>
            </div>
            <div id='right-nav'>
                <Link to="/login">
                    <h3>Login</h3>
                </Link>
                <Link to="/register">
                    <h3>Sign Up</h3>
                </Link>
                <Link to="/account">
                    <h3>View Account</h3>
                </Link>

                <GoogleLogout
                    clientId="793531866299-a0lqtj70qp6s1200hhpl08rba6195m7h.apps.googleusercontent.com"
                    buttonText={"Logout"}
                    onLogoutSuccess={onSuccess}
                />

            </div>
        </>

    )
}

export default NavLinks;