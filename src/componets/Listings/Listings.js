import axios from 'axios'
import Listing from './Listing'
import '../../css/Listing.css'
import { useState, useEffect } from 'react'

const Listings = () => {

    // Check localStorage for existing listings to initialize state
    let [listings, setListings] = useState(() => {
        const storedListings = localStorage.getItem('listings');
        return storedListings ? JSON.parse(storedListings) : [];
    });

    let [savedListing, setSavedListings] = useState([]);
    const [loading, setLoading] = useState(listings.length === 0); // Only show loader if no existing listings


    // Grabs the Listings from the Backend
    const grabListings = async () => {

        try {
            // var grabListingsData = await (await axios.get('https://backend.e46finder.app/scrape', {withCredentials: true })).data // for production site
            var grabListingsData = await axios.get('http://localhost:5000/scrape', { withCredentials: true });
            setListings(grabListingsData.data);

            // Save the new listings to localStorage
            localStorage.setItem('listings', JSON.stringify(grabListingsData.data));

            setLoading(false);
        } catch (err) {
            console.log(err);
        };

    };

    // Fetch listings on component mount
    useEffect(() => {
        grabListings();
    }, []);

    const grabSavedListings = async () => {

        try {
            // var grabSavedListingsData = await axios.get('https://backend.e46finder.app/accountpagesavedlistings', { withCredentials: true }); // for production site
            var grabSavedListingsData = await axios.get('http://localhost:5000/accountpagesavedlistings', { withCredentials: true });
            setSavedListings(grabSavedListingsData.data);
        } catch (err) {
            console.log(err);
        };

    };

    useEffect(() => {
        grabSavedListings();
    }, []);


    // Checks for Logged-In Cookie
    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin === -1) {
            begin = dc.indexOf(prefix);
            if (begin !== 0) return null;
        }
        else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end === -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    // Logic that looks for the LooggedIn cookie based off of the result of the function getCookie(name)
    var loggedInCookie = getCookie("LoggedIn");

    let jsonArray = []
    let isLoggedIn = false

    // Checks to see if user has already saved listings
    if (loggedInCookie) {
        // Get postNum from DB and sends param to listing.jsx that says already saved or not
        isLoggedIn = true;

        // Grabs all postNum values and puts them into Sets
        const savedSet = new Set(savedListing.map(saved => saved.postNum));

        // Create an array indicating if each listing is already saved or not
        jsonArray = listings.map(listing => savedSet.has(listing.postNum));
    }

    return (
        <>
            <h1 id='listings-header'> Listings </h1>
            <div className='listings-wrapper'>
                {loading ? (listings.map((listing, saved) => {
                    const alreadySaved = jsonArray[saved];
                    return (
                        <Listing
                            key={listing.postNum}
                            site={listing.site}
                            link={listing.link}
                            car={listing.car}
                            price={listing.price}
                            picture={listing.picture}
                            timeleft={listing.timeLeft}
                            mileage={listing.mileage}
                            location={listing.location}
                            trans={listing.trans}
                            postNum={listing.postNum}
                            isAlreadySaved={alreadySaved}
                            loggedInCookie={isLoggedIn}
                        />
                    )

                })) :
                    <div id="loader-wrapper">
                        <span className="loader"></span>
                        <span id="loading-text">Loading Listings This Could Take a Minute...</span>
                    </div>
                }
            </div>

        </>
    )

}

export default Listings