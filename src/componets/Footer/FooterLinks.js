import Logo from '../../logos-icons/e46-logo.jpg'
import { Link, useLocation } from 'react-router-dom'

function FooterLinks() {
    const { pathname } = useLocation();
    const isAccount = pathname === '/account';

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

    // Logic that sets links in footer based off of the result of the function getCookie(name)
    var loggedInCookie = getCookie("LoggedIn");

    if (loggedInCookie == null) {
        return (
            <>
                <div className='footer-left'>
                    <Link to="/">
                        <img src={Logo} alt='E46 Logo' />
                    </Link>
                </div>

                <div className='footer-center'>
                    <h5>&copy; Copyright 2025 Alexander Murdock</h5>
                </div>

                <div className='footer-right'>
                    <Link to="/login">
                        <h3>Login</h3>
                    </Link>
                    <Link to="/about">
                        <h3>About</h3>
                    </Link>
                </div>
            </>
        )
    } else if (loggedInCookie) {
        if (isAccount) {
            return (
                <>
                    <div className='footer-left'>
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>

                    <div className='footer-center'>
                        <h5>&copy; Copyright 2025 Alexander Murdock</h5>
                    </div>

                    <div className='footer-right'>
                        <Link to='/'>
                            <h3>Listings</h3>
                        </Link>

                        <Link to="/about">
                            <h3>About</h3>
                        </Link>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className='footer-left'>
                        <Link to="/">
                            <img src={Logo} alt='E46 Logo' />
                        </Link>
                    </div>

                    <div className='footer-center'>
                        <h5>&copy; Copyright 2025 Alexander Murdock</h5>
                    </div>

                    <div className='footer-right'>
                        <Link to="/account">
                            <h3>View Account</h3>
                        </Link>

                        <Link to="/about">
                            <h3>About</h3>
                        </Link>
                    </div>
                </>
            )
        }
    }


}

export default FooterLinks
