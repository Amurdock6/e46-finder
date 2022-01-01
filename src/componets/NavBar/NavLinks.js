import Logo from '../../logos-icons/e46-logo.jpg'

const NavLinks = () => {
    return(
        <>
            <div id="left-nav">
                <h3>About</h3>
            </div>
            <div id="middle-nav">
                <img src={Logo} alt='E46 Logo'/>
            </div>
            <div id='right-nav'>
                <h3>Login/Sign Up</h3>
                <h3>View Account</h3>
            </div>
        </>
    )
}

export default NavLinks;