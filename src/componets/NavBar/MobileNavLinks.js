import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import {  googleLogout } from '@react-oauth/google';
import './NavLinks.css'

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

    // Logout logic
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:5000/googlelogout', {
                withCredentials: true,
            });
            navigate('/logout');
        } catch (error) {
            console.log(error);
        }
    };


    // Redirect to confirmation page to delete users account
    const deleteAccount = async () => {
        navigate('/deleted');
    };

    var loggedInCookie = getCookie("LoggedIn");

    if (loggedInCookie == null) {
        if (window.location.href === 'http://localhost:3000/about') {
            return (

                <>
                    <Link to='/'>
                        <h3>Listings</h3>
                    </Link>
                    <Link to="/login">
                        <h3>Login</h3>
                    </Link>
                    <Link to="/register">
                        <h3>Sign Up</h3>
                    </Link>
                    <div className="menu-background"></div>
                </>

            )
        }
        if (window.location.href === 'http://localhost:3000') {
            return (

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

            )
        }
        return (

            <>
                <Link to='/'>
                    <h3>Listings</h3>
                </Link>
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

        )
    }
    else if (loggedInCookie) {
        if (window.location.href === 'http://localhost:3000/account') {
            return (
                <>
                    <Link to='/about'>
                        <h3>About</h3>
                    </Link>

                    <Link to='/'>
                        <h3>Listings</h3>
                    </Link>

                    <h3>
                        <button onClick={deleteAccount} id="delete"><p>Delete Account</p></button>
                    </h3>


                    <button onClick={handleLogout} id="logout"><p>Log Out</p></button>
                    {/* <googleLogout
                        clientId="793531866299-a0lqtj70qp6s1200hhpl08rba6195m7h.apps.googleusercontent.com"
                        render={renderProps => (
                            <button id="logout" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
                        )}
                        buttonText={"Logout"}
                        onLogoutSuccess={onSuccess}
                    /> */}
                    <div className="menu-background"></div>

                </>

            )
        }
        if (window.location.href === 'http://localhost:3000/about') {
            return (

                <>
                    <Link to='/'>
                        <h3>Listings</h3>
                    </Link>
                    <Link to="/account">
                        <h3>View Account</h3>
                    </Link>

                    <button onClick={handleLogout} id="logout"><p>Log Out</p></button>
                    {/* <googleLogout
                        clientId={clientId}
                        render={renderProps => (
                            <button id="logout" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
                        )}
                        buttonText={"Logout"}
                        onLogoutSuccess={onSuccess} */}
                    {/* /> */}
                    <div className="menu-background"></div>
                </>

            )
        }
        if (window.location.href === 'http://localhost:3000') {
            return (

                <>
                    <Link to='/about'>
                        <h3>About</h3>
                    </Link>
                    <Link to="/account">
                        <h3>View Account</h3>
                    </Link>

                    <button onClick={handleLogout} id="logout"><p>Log Out</p></button>
                    {/* <googleLogout
                        clientId={clientId}
                        render={renderProps => (
                            <button id="logout" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
                        )}
                        buttonText={"Logout"}
                        onLogoutSuccess={onSuccess}
                    /> */}
                    <div className="menu-background"></div>
                </>

            )
        }
        return (
            <>
                <Link to='/about'>
                    <h3>About</h3>
                </Link>
                <Link to="/account">
                    <h3>View Account</h3>
                </Link>

                <button onClick={handleLogout} id="logout"><p>Log Out</p></button>
                {/* <googleLogout
                    clientId={clientId}
                    render={renderProps => (
                        <button id="logout" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
                    )}
                    buttonText={"Logout"}
                    onLogoutSuccess={onSuccess}
                /> */}
                <div className="menu-background"></div>

            </>
        )
    }
}

export default MobileNavLinks;