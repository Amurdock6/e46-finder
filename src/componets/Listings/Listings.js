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
                console.log('Backend URL:', process.env.BACKEND_URL);
                const response = await axios.get(`${process.env.BACKEND_URL}/scrape`, { withCredentials: true });
                console.log('Listings fetched:', response.data); // Log response data
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
            const response = await axios.get(`${process.env.BACKEND_URL}/accountpagesavedlistings`, { withCredentials: true });
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
