import axios from 'axios';
import Listing from './Listing';
import '../../css/Listing.css';
import { useState, useEffect } from 'react';

const Listings = () => {
    // Check localStorage for existing listings to initialize state
    let [listings, setListings] = useState(() => {
        const storedListings = localStorage.getItem('listings');
        return storedListings ? JSON.parse(storedListings) : [];
    });

    let [savedListing, setSavedListings] = useState([]);
    const [loading, setLoading] = useState(listings.length === 0); // Only show loader if no cached listings exist
    const [hasFetched, setHasFetched] = useState(false); // Used to track whether we have fetched from server

    // Grabs the Listings from the Backend
    const grabListings = async () => {
        try {
            // Set loading state to true only if there are no cached listings
            if (listings.length === 0) {
                setLoading(true);
            }

            const response = await axios.get('http://localhost:5000/scrape', { withCredentials: true });

            setListings(response.data);

            // Save the new listings to localStorage
            localStorage.setItem('listings', JSON.stringify(response.data));

            // Mark that we have finished fetching data
            setHasFetched(true);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setLoading(false); // Ensure loading is set to false even if there is an error
        }
    };

    // Fetch listings on component mount if we haven't fetched them yet
    useEffect(() => {
        if (!hasFetched) {
            grabListings();
        }
    }, [hasFetched]);

    const grabSavedListings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/accountpagesavedlistings', { withCredentials: true });
            setSavedListings(response.data);
        } catch (err) {
            console.error('Error fetching saved listings:', err);
        }
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
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end === -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    // Logic that looks for the LoggedIn cookie based off of the result of the function getCookie(name)
    const loggedInCookie = getCookie("LoggedIn");

    let jsonArray = [];
    let isLoggedIn = false;

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
                {/* Show loading spinner only if we don't have cached listings and are fetching */}
                {loading && listings.length === 0 ? (
                    <div id="loader-wrapper">
                        <span className="loader"></span>
                        <span id="loading-text">Loading Listings This Could Take a Minute...</span>
                    </div>
                ) : (
                    listings.map((listing, index) => {
                        const alreadySaved = jsonArray[index];
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
                        );
                    })
                )}
            </div>
        </>
    );
};

export default Listings;
