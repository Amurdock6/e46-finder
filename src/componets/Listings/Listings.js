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

    // State for storing saved listings (pointers)
    let [savedListing, setSavedListings] = useState([]);
    // State to manage the loading spinner; initially true if no cached listings
    const [loading, setLoading] = useState(listings.length === 0);
    // State to track whether data has already been fetched to avoid redundant requests
    const [hasFetched, setHasFetched] = useState(false);

    // useEffect for fetching listings data from the backend
    useEffect(() => {
        const grabListings = async () => {
            try {
                if (listings.length === 0) {
                    setLoading(true);
                }
                // Fetch the listings from the backend (expecting expiresAt and listingId)
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/scrape`,
                    { withCredentials: true }
                );
                setListings(response.data);
                localStorage.setItem('listings', JSON.stringify(response.data));
                setHasFetched(true);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching listings:', err);
                setLoading(false);
            }
        };

        if (!hasFetched) {
            grabListings();
        }
    }, [listings.length, hasFetched]);

    // Function to grab saved listings from the backend
    const grabSavedListings = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/accountpagesavedlistings`,
                { withCredentials: true }
            );
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
    const dc = document.cookie;
    const prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    if (begin === -1) {
      begin = dc.indexOf(prefix);
      if (begin !== 0) return null;
    } else {
      begin += 2;
      const end = document.cookie.indexOf(";", begin);
      if (end === -1) {
        begin = dc.length;
      }
    }
    return decodeURI(dc.substring(begin + prefix.length));
  }

  const loggedInCookie = getCookie("LoggedIn");
  let isLoggedIn = !!loggedInCookie;

  // Create a Set of saved listing IDs from the savedListing state.
  const savedArray = Array.isArray(savedListing) ? savedListing : [];
  const savedSet = new Set(savedArray.map(saved => saved.listingId));

  return (
    <>
      <h1 id='listings-header'> Listings </h1>
      <div className='listings-wrapper'>
        {loading && listings.length === 0 ? (
          <div id="loader-wrapper">
            <span className="loader"></span>
            <span id="loading-text">
              Loading Listings This Could Take a Minute...
            </span>
          </div>
        ) : (
          listings.map((listing) => {
            if (!listing.listingId) {
              console.warn("Listing missing listingId", listing);
            }
            const alreadySaved = savedSet.has(listing.listingId);
            return (
              <Listing
                key={listing.listingId}
                listingId={listing.listingId}
                site={listing.site}
                link={listing.link}
                car={listing.car}
                price={listing.price}
                picture={listing.picture}
                expiresAt={listing.expiresAt}  
                mileage={listing.mileage}
                location={listing.location}
                transmission={listing.transmission}
                timeLeftText={listing.timeLeftText}   
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