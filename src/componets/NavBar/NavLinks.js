import Logo from '../../logos-icons/e46-logo.jpg'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

const NavLinks = () => {
    return(

        <>
            <div id="left-nav">
                <Link to='/about'>
                    <h3>About</h3>
                </Link>
            </div>
            <div id="middle-nav">
                <Link to="/">
                    <img src={Logo} alt='E46 Logo'/>
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
            </div>
        </>

    )
}

export default NavLinks;