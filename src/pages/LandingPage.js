import NavBar from '../componets/NavBar/NavBar.js'
import Slide1 from '../pictures/slide-1.jpg'
import '../css/LandingPage.css';

const LandingPage = () => {
    return(
        <div className='wrapper'>
            <NavBar />

            <div className='top-img'>
                <img src={Slide1} alt='E46 Slide Show Pic 1'/>
            </div>
        </div>
    )
}

export default LandingPage