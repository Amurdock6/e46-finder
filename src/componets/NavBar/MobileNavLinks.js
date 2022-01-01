const MobileNavLinks = (props) => {
    return(
        <>
            <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>Login</h3>
            <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>Sign Up</h3>
            <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>View Account</h3>
            <h3 onClick={() => props.isMobile && props.closeMobileMenu()}>About</h3>
            <div className="menu-background"></div>
        </>
    )
}

export default MobileNavLinks;