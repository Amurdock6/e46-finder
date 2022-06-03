import MobileNavLinks from './MobileNavLinks.js'
import classes from './NavBar.module.css'
import {FcMenu} from 'react-icons/fc'
import {IoMdClose} from 'react-icons/io'
import {useState} from 'react'
import Logo from '../../logos-icons/e46-logo.jpg'

const MobileNav = () => {

    const [open, setOpen] = useState(false);

    const hamburgerIcon = <FcMenu className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    const closeIcon = <IoMdClose className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    const closeMobileMenu = () => setOpen(false);

    return(
        <nav id="nav" className={classes.MobileNav}>
            <div id="mobile-logo">
                <img src={Logo} alt='E46 Logo'/>
            </div>
            {open ? closeIcon : hamburgerIcon}
            {open && <MobileNavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
        </nav>
     )
}

export default MobileNav;