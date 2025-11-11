import NavBar from '../componets/NavBar/NavBar.js'
import Footer from '../componets/Footer/Footer'
import Slide1 from '../pictures/slide-1.webp'
import Slide2 from '../pictures/mobile_front.webp'
import Listings from '../componets/Listings/Listings'
import '../css/LandingPage.css';


const LandingPage = () => {

    return (
        <div className='wrapper'>
            <NavBar />

            <div className='top-img'>
                <img src={Slide1} alt='E46 M3 crusing down the road' />
            </div>

            <div className='top-img-mobile'>
                <img src={Slide2} alt='E46 M3 crusing down the road' />
            </div>

            <div className='listings-container'>
                <Listings />
            </div>

            <Footer />
        </div>

    )
}

export default LandingPage