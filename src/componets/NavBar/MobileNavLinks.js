import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

const MobileNavLinks = (props) => {
    return(
        <>

            <Link to="/login">
                <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>Login</h3>
            </Link>
            <Link to="/register">
                <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>Sign Up</h3>
            </Link>
            <Link to="/Account">
                <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>View Account</h3>
            </Link>
            <Link to="/About">
                <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>About</h3>
            </Link>
            <div className="menu-background"></div>

        </>
    )
}

export default MobileNavLinks;