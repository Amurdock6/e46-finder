/**
 * Listings grid
 * - Fetches scraped listings from the backend (`/scrape`) and caches them in localStorage to soften reloads.
 * - Fetches saved listings for the logged-in user to mark already-saved items.
 * - Chooses a stable React key and passes the correct `timeleft` shape to child Listing:
 *   - Prefer `timeLeftText` (e.g., "3 days" or "hh:mm:ss") then fallback to ISO `expiresAt`.
 */
import axios from 'axios';
import Listing from './Listing';
import '../../css/Listing.css';
import { useState, useEffect } from 'react';

const Listings = () => {
    // State for storing car listings; initially fetched from local storage if available
    let [listings, setListings] = useState(() => {
        const storedListings = localStorage.getItem('listings');
        return storedListings ? JSON.parse(storedListings) : [];
    });

    // State for storing saved listings
    let [savedListing, setSavedListings] = useState([]);
    // State to manage the loading spinner; initially true if no cached listings
    const [loading, setLoading] = useState(listings.length === 0);
    // State to track whether data has already been fetched to avoid redundant requests
    const [hasFetched, setHasFetched] = useState(false);

    // useEffect for fetching listings data from the backend
    useEffect(() => {
        const grabListings = async () => {
            try {
                // Show the loading spinner only if there are no cached listings
                if (listings.length === 0) {
                    setLoading(true);
                }

                // Fetch the listings from the backend
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape`, { withCredentials: true });
                setListings(response.data);

                // Save the fetched listings to local storage
                localStorage.setItem('listings', JSON.stringify(response.data));

                // Mark that data has been fetched and set loading to false
                setHasFetched(true);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching listings:', err);
                setLoading(false); // Ensure loading state is set to false even if there is an error
            }
        };

        // Only fetch listings if they have not already been fetched
        if (!hasFetched) {
            grabListings();
        }
    }, [listings.length, hasFetched]); // Dependencies to ensure effect runs only when needed

    // Function to grab saved listings from the backend
    const grabSavedListings = async () => {
        try {
            // Fetch the saved listings for the logged-in user
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/accountpagesavedlistings`, { withCredentials: true });
            setSavedListings(response.data);
        } catch (err) {
            console.error('Error fetching saved listings:', err);
        }
    };

    // useEffect for fetching saved listings; runs once on component mount
    useEffect(() => {
        grabSavedListings();
    }, []); // Empty dependency array means this effect runs only once

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
        // User is logged in; compute already-saved flags by matching on link
        isLoggedIn = true;

        // Build a set of saved listing links for quick lookup
        const savedLinkSet = new Set(savedListing.map(saved => saved.link));

        // Mark listings as saved if their link exists in the saved set
        jsonArray = listings.map(listing => savedLinkSet.has(listing.link));
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
                                key={listing.listingId || listing.link || index}
                                site={listing.site}
                                link={listing.link}
                                car={listing.car}
                                price={listing.price}
                                picture={listing.picture}
                                timeleft={listing.timeLeftText || listing.timeLeft || listing.expiresAt}
                                mileage={listing.mileage}
                                location={listing.location}
                                trans={listing.trans}
                                postNum={listing.postNum || listing.listingId || index}
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
