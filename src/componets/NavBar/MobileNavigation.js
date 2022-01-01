import MobileNavLinks from './MobileNavLinks.js'
import classes from './NavBar.module.css'
import {FcMenu} from 'react-icons/fc'
import {IoMdClose} from 'react-icons/io'
import {useState} from 'react'

const MobileNav = () => {

    const [open, setOpen] = useState(false);

    const hamburgerIcon = <FcMenu className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    const closeIcon = <IoMdClose className={classes.Hamburger} size='40px' color='#fff' 
    onClick={() => setOpen(!open)} />

    return(
        <nav id="nav" className={classes.MobileNav}>
            {open ? closeIcon : hamburgerIcon}
            {open && <MobileNavLinks />}
        </nav>
     )
}

export default MobileNav;