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
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const Listings = () => {
    // State for storing car listings; initially fetched from local storage if available
    let [listings, setListings] = useState(() => {
        const storedListings = localStorage.getItem('listings');
        return storedListings ? JSON.parse(storedListings) : [];
    });

    // State for storing user-created listings
    let [userListings, setUserListings] = useState(() => {
        const stored = localStorage.getItem('userListings');
        return stored ? JSON.parse(stored) : [];
    });

    // State for storing saved listings
    let [savedListing, setSavedListings] = useState([]);
    // State to manage the loading spinner; initially true if no cached listings
    const [loading, setLoading] = useState(listings.length === 0 && userListings.length === 0);
    // State to track whether data has already been fetched to avoid redundant requests
    const [hasFetched, setHasFetched] = useState(false);
    // Timer ref used to poll while backend warms up (202/empty array)
    const pollTimeoutRef = useRef(null);
    // Track last-scraped timestamp derived from results
    const [lastScrapedAt, setLastScrapedAt] = useState(() => {
        if (!Array.isArray(listings) || listings.length === 0) return null;
        const ts = listings
            .map(l => Date.parse(l.scrapedAt))
            .filter(n => Number.isFinite(n));
        if (!ts.length) return null;
        return new Date(Math.max.apply(null, ts));
    });
    // Ticking state to re-render relative label every minute
    const [nowTick, setNowTick] = useState(Date.now());

    // Shared fetcher for listings (used by effect and Refresh button)
    const grabListings = useCallback(async () => {
        try {
            if (listings.length === 0 && userListings.length === 0) {
                setLoading(true);
            }
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scrape`, { withCredentials: true });
            const data = response.data || [];
            const warming = (response.status === 202) || (Array.isArray(data) && data.length === 0);

            if (warming) {
                if (listings.length === 0 && userListings.length === 0) {
                    setLoading(true);
                }
                if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
                pollTimeoutRef.current = setTimeout(grabListings, 5000);
                return;
            }

            if (Array.isArray(data) && data.length > 0) {
                setListings(data);
                localStorage.setItem('listings', JSON.stringify(data));
                const ts = data
                    .map(l => Date.parse(l.scrapedAt))
                    .filter(n => Number.isFinite(n));
                if (ts.length) {
                    setLastScrapedAt(new Date(Math.max.apply(null, ts)));
                }
            }

            setHasFetched(true);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching listings:', err);
            if (listings.length === 0 && userListings.length === 0) {
                setLoading(true);
                if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
                pollTimeoutRef.current = setTimeout(grabListings, 7000);
            } else {
                setLoading(false);
            }
        }
    }, [listings.length, userListings.length]);

    // useEffect for fetching listings data from the backend
    useEffect(() => {
        if (!hasFetched) {
            grabListings();
        }
        return () => {
            if (pollTimeoutRef.current) {
                clearTimeout(pollTimeoutRef.current);
                pollTimeoutRef.current = null;
            }
        };
    }, [hasFetched, grabListings]);

    const grabUserListings = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings`, { withCredentials: true });
            const data = response.data || [];
            if (Array.isArray(data)) {
                setUserListings(data);
                localStorage.setItem('userListings', JSON.stringify(data));
                if (data.length > 0) {
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error('Error fetching user listings:', err);
        }
    }, []);

    useEffect(() => {
        grabUserListings();
    }, [grabUserListings]);

    // Manual refresh removed; no rate limiting state

    // Recompute last-scraped when listings change (covers cache-load path)
    useEffect(() => {
        if (!Array.isArray(listings) || listings.length === 0) return;
        const ts = listings
            .map(l => Date.parse(l.scrapedAt))
            .filter(n => Number.isFinite(n));
        if (ts.length) {
            setLastScrapedAt(new Date(Math.max.apply(null, ts)));
        }
    }, [listings]);

    // Update relative time label every minute
    useEffect(() => {
        const id = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(id);
    }, []);

    // Format a human-friendly relative label
    const lastUpdatedLabel = useMemo(() => {
        if (!lastScrapedAt) return '';
        const diffMs = Date.now() - lastScrapedAt.getTime();
        const sec = Math.max(0, Math.floor(diffMs / 1000));
        if (sec < 30) return 'just now';
        if (sec < 90) return '1 minute ago';
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min} minutes ago`;
        const hrs = Math.floor(min / 60);
        if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
        const days = Math.floor(hrs / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }, [lastScrapedAt, nowTick]);

    const displayListings = useMemo(() => {
        return [...userListings, ...listings];
    }, [userListings, listings]);

    const savedLinkSet = useMemo(() => {
        return new Set(savedListing.map(saved => saved.link));
    }, [savedListing]);

    // Legacy refresh UI stubs removed; keep safe no-ops for JSX still present
    const refreshing = false;
    const onRefresh = () => {};
    const rateLimitedInfo = null;
    const formatMs = () => '';

    // No refresh cooldown UI

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
    const isLoggedIn = !!loggedInCookie;

    return (
        <>
            <h1 id='listings-header'> Listings </h1>
            {lastScrapedAt && (
                <div className='listings-status' title={lastScrapedAt.toLocaleString()} aria-label={`Last updated ${lastUpdatedLabel}`}>
                    <span className='status-icon' aria-hidden>⏱</span>
                    <span className='status-text'>Last updated {lastUpdatedLabel}</span>
                    <button
                        type='button'
                        className={`status-refresh ${refreshing ? 'spin' : ''}`}
                        onClick={onRefresh}
                        aria-label='Refresh listings'
                        disabled={refreshing || (rateLimitedInfo && rateLimitedInfo.limited)}
                        title={(rateLimitedInfo && rateLimitedInfo.limited) ? `Try again in ${formatMs(rateLimitedInfo.remainingMs)}, requset limit hit` : 'Refresh listings'}
                    >
                        ↻
                    </button>
                    {(rateLimitedInfo && rateLimitedInfo.limited) && (
                        <span className='status-hint'>Try again in {formatMs(rateLimitedInfo.remainingMs)}, requset limit hit</span>
                    )}
                </div>
            )}
            <div className='listings-wrapper'>
                {/* Show loading spinner only if we don't have cached listings and are fetching */}
                {loading && displayListings.length === 0 ? (
                    <div id="loader-wrapper">
                        <span className="loader"></span>
                        <span id="loading-text">Loading Listings This Could Take a Minute...</span>
                    </div>
                ) : (
                    displayListings.map((listing, index) => {
                        const alreadySaved = isLoggedIn && savedLinkSet.has(listing.link);
                        return (
                            <Listing
                                key={listing.listingId || listing.link || index}
                                site={listing.site || 'e46finder.com'}
                                link={listing.link || '#'}
                                car={listing.car || listing.title}
                                price={listing.price || 'N/A'}
                                picture={listing.picture || (Array.isArray(listing.images) ? listing.images[0] : '')}
                                images={listing.images}
                                description={listing.description}
                                timeleft={listing.timeLeftText || listing.timeLeft || listing.expiresAt}
                                mileage={listing.mileage || 'N/A'}
                                location={listing.location || 'N/A'}
                                trans={listing.trans || listing.transmission || 'N/A'}
                                postNum={listing.postNum || listing.listingId || index}
                                listedBy={listing.listedBy || listing.username}
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
