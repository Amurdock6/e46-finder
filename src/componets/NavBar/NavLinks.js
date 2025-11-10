import Logo from '../../logos-icons/e46-logo.jpg'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
// import { googleLogout } from '@react-oauth/google';
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


    // Logs out the current user
    const handleLogout = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/googlelogout`, {
                withCredentials: true
            });
            // googleLogout(); // Calls Google's logout logic
            navigate('/logout');
        } catch (error) {
            console.log(error);
        }
    };

    // Redirect to confirmation page to delete users account
    const deleteAccount = async () => {
        navigate('/deleted');
    }

    // Logic that sets links in nav based off of the result of the function getCookie(name)
    var loggedInCookie = getCookie("LoggedIn");

    if (loggedInCookie == null) {
        if (window.location.href === 'http://localhost:3000/') {
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
                            <h3 id="loginnav">Login</h3>
                        </Link>
                        <Link to="/register">
                            <h3 id="registernav">Sign Up</h3>
                        </Link>

                    </div>
                </>
            )
        }
        if (window.location.href === 'http://localhost:3000/account') {
            return (
                <>
                    <div id="left-nav">
                        <Link to='/about'>
                            <h3>About</h3>
                        </Link>

                        <Link to='/'>
                            <h3>Listings</h3>
                        </Link>

                    </div>
                    <div id="middle-nav">
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>
                    <div id='right-nav'>
                        <Link to="/login">
                            <h3 id="loginnav">Login</h3>
                        </Link>
                        <Link to="/register">
                            <h3 id="registernav">Sign Up</h3>
                        </Link>

                    </div>
                </>
            )
        }

        if (window.location.href === 'http://localhost:3000/about') {
            return (
                <>
                    <div id="left-nav">
                        <Link to='/'>
                            <h3>Listings</h3>
                        </Link>

                    </div>
                    <div id="middle-nav">
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>
                    <div id='right-nav'>
                        <Link to="/login">
                            <h3 id="loginnav">Login</h3>
                        </Link>
                        <Link to="/register">
                            <h3 id="registernav">Sign Up</h3>
                        </Link>

                    </div>
                </>
            )
        }

        return (
            <>
                <div id="left-nav">
                    <Link to='/about'>
                        <h3>About</h3>
                    </Link>

                    <Link to='/'>
                        <h3>Listings</h3>
                    </Link>

                </div>
                <div id="middle-nav">
                    <Link to="/">
                        <img src={Logo} alt='E46 Logo' />
                    </Link>
                </div>
                <div id='right-nav'>
                    <Link to="/login">
                        <h3 id="loginnav">Login</h3>
                    </Link>
                    <Link to="/register">
                        <h3 id="registernav">Sign Up</h3>
                    </Link>

                </div>
            </>
        )
    }
    else if (loggedInCookie) {
        if (window.location.href === 'http://localhost:3000/') {
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
                        <Link to="/account">
                            <h3 id="viewAccount">View Account</h3>
                        </Link>

                        <button id="logout" onClick={handleLogout}>Log Out</button>
                    </div>
                </>
            )
        }

        if (window.location.href === 'http://localhost:3000/account') {
            return (
                <>
                    <div id="left-nav">
                        <Link to='/about'>
                            <h3>About</h3>
                        </Link>

                        <h3>
                            <button onClick={deleteAccount} id="delete"><p>Delete Account</p></button>
                        </h3>
                    </div>
                    <div id="middle-nav">
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>
                    <div id='right-nav'>
                        <Link to='/'>
                            <h3>Listings</h3>
                        </Link>

                        <button id="logout" onClick={handleLogout}>Log Out</button>

                    </div>
                </>
            )
        }

        if (window.location.href === 'http://localhost:3000/about') {
            return (
                <>
                    <div id="left-nav">
                        <Link to='/'>
                            <h3>Listings</h3>
                        </Link>

                    </div>
                    <div id="middle-nav">
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>
                    <div id='right-nav'>
                        <Link to="/account">
                            <h3 id="viewAccount">View Account</h3>
                        </Link>

                        <button id="logout" onClick={handleLogout}>Log Out</button>
                    </div>
                </>
            )
        }
        return (
            <>
                <div id="left-nav">
                    <Link to='/about'>
                        <h3>About</h3>
                    </Link>

                    <Link to='/'>
                        <h3>Listings</h3>
                    </Link>
                </div>
                <div id="middle-nav">
                    <Link to="/">
                        <img src={Logo} alt='E46 Logo' />
                    </Link>
                </div>
                <div id='right-nav'>
                    <Link to="/account">
                        <h3 id="viewAccount">View Account</h3>
                    </Link>
                    <button id="logout" onClick={handleLogout}>Log Out</button>

                </div>
            </>
        )
    }
}

export default NavLinks;
