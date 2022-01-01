import NavBar from '../componets/NavBar/NavBar.js'
import Slide1 from '../pictures/slide-1.jpg'
import '../css/LandingPage.css';

const LandingPage = () => {
    return(
        <>
            <NavBar />

            <div className='top-img'>
                <img src={Slide1} alt='E46 Slide Show Pic 1'/>
            </div>
        </>
    )
}

export default LandingPage