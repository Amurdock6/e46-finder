import NavLinks from './NavLinks.js'
import classes from './NavBar.module.css'

const Nav = () => {
    return (
        <nav id="nav" className={classes.Nav}>
            <NavLinks />
        </nav>
    )
}

export default Nav