import NavBar from '../componets/NavBar/NavBar.js'
import Footer from '../componets/Footer/Footer'
import Slide1 from '../pictures/slide-1.jpg'
import Listings from '../componets/Listings/Listings'
import '../css/LandingPage.css';
import ReactGA from 'react-ga';
import { useEffect } from 'react';




const LandingPage = () => {

    useEffect (() => {
        ReactGA.initialize('G-X1RJGE867Q');
    
        // Reports page views
        ReactGA.pageview(window.location.pathname + window.location.search);
      })

    return (
        <div className='wrapper'>
            <NavBar />

            <div className='top-img'>
                <img src={Slide1} alt='E46 Slide Show Pic 1' />
            </div>

            <div className='listings-container'>
                <Listings />
            </div>

            <Footer />
        </div>

    )
}

export default LandingPage