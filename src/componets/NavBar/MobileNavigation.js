/**
 * MobileNavigation
 * - Hamburger menu for small screens. Locks page scroll while open to keep the menu focused.
 */
import MobileNavLinks from './MobileNavLinks.js'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import classes from './NavBar.module.css'
import {FcMenu} from 'react-icons/fc'
import {IoMdClose} from 'react-icons/io'
import {useState, useEffect} from 'react'
import Logo from '../../logos-icons/e46-logo.jpg'

const MobileNav = () => {

    const [open, setOpen] = useState(false);

    const hamburgerIcon = <FcMenu className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    const closeIcon = <IoMdClose className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    const closeMobileMenu = () => setOpen(false);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (open) {
            const prevBodyOverflow = document.body.style.overflow;
            const prevHtmlOverflow = document.documentElement.style.overflow;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevBodyOverflow;
                document.documentElement.style.overflow = prevHtmlOverflow;
            };
        }
    }, [open]);

    return(
        <nav id="nav" className={classes.MobileNav}>
            <div id="mobile-logo">
            <Link to="/">
                <img src={Logo} alt='E46 Logo' />
            </Link>
            </div>
            {open ? closeIcon : hamburgerIcon}
            {open && <MobileNavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
        </nav>
     )
}

export default MobileNav;
