import Logo from '../../logos-icons/e46-logo.jpg'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function FooterLinks() {
    return (
        <>
            <div className='footer-left'>
                <Link to="/">
                    <img src={Logo} alt='E46 Logo' />
                </Link>
            </div>

            <div className='footer-center'>
                <h5>&copy; Copyright 2022 Murdock Web Development</h5>
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

export default FooterLinks
