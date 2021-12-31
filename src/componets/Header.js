import Logo from '../logos-icons/e46-logo.jpg'
import Slide1 from '../pictures/slide-1.jpg'

export const Header = () => {
    return (
        <>
        <nav id="nav">
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
        </nav>
        <div className='top-img'>
            <img src={Slide1} alt='E46 Slide Show Pic 1'/>
        </div>
        </>
    )
}

export default Header