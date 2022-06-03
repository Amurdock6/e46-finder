import Nav from './Navigation.js'
import MobileNav from './MobileNavigation.js'
import './NavBar.module.css'
import classes from './NavBar.module.css'
import './NavLinks.css'


export const NavBar = () => {
    return (
            <div className={classes.NavBar}>
                <Nav />
                <MobileNav />
            </div>

    )
}

export default NavBar