import NavBar from '../componets/NavBar/NavBar.js'
import Footer from '../componets/Footer/Footer'
import Slide1 from '../pictures/slide-1.webp'
import Slide2 from '../pictures/mobile_front.webp'
import Listings from '../componets/Listings/Listings'
import '../css/LandingPage.css';
import { useEffect, useState } from 'react';


const LandingPage = () => {
    const [showIndicator, setShowIndicator] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = (window.scrollY || window.pageYOffset || 0);
            const doc = document.documentElement;
            const maxScroll = Math.max(1, (doc.scrollHeight - window.innerHeight));
            const progress = scrollTop / maxScroll; // 0.0 at top, 1.0 at bottom
            // Show until ~40% down the page
            setShowIndicator(progress < 0.4);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        // initialize state based on current position
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className='wrapper'>
            <NavBar />

            <div className='top-img'>
                <img src={Slide1} alt='E46 M3 crusing down the road' />
            </div>

            <div className='top-img-mobile'>
                <img src={Slide2} alt='E46 M3 crusing down the road' />
            </div>

            {showIndicator && (
                <div className='scroll-indicator' aria-hidden="true">
                    <span className='scroll-indicator__chevron'>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            )}

            <div className='listings-container'>
                <Listings />
            </div>

            <Footer />
        </div>

    )
}

export default LandingPage
