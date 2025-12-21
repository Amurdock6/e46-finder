/**
 * Account page
 * - Fetches the username and the user's saved listings.
 * - Renders saved listings with Listing component; save button hidden and unsave shown.
 * - Saved `timeleft` is an absolute Date from the backend; Listing handles countdown display.
 */
import axios from "axios"
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import Listing from '../componets/Listings/Listing'
import '../css/Account.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function Account() {

    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [listings, setListings] = useState();
    const [userListings, setUserListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState('');
    const [confirmId, setConfirmId] = useState('');

    useEffect(() => {
      const fetchUsername = async () => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/accountpageusername`, { withCredentials: true })
        
          .then(res => {
              setUsername(res.data)
          }, )
  
      };
  
      fetchUsername()
    }, []);

    const grabListings = async () => {

        try {
            var grabListingsData = await (await axios.get(`${process.env.REACT_APP_BACKEND_URL}/accountpagesavedlistings`, { withCredentials: true })).data
            setListings(grabListingsData)
            setLoading(true);
            
        } catch (err) {
            console.log(err);
        };

    };

    useEffect(() => {
        grabListings();
    }, []); // will only run once when the component mounts

    useEffect(() => {
        const grabUserListings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userlistings`, { withCredentials: true });
                setUserListings(response.data || []);
            } catch (err) {
                console.error('Error fetching user listings:', err);
            }
        };
        grabUserListings();
    }, []);
    
    useEffect(() => {
        var els = document.getElementsByClassName("save");
        var el2s = document.getElementsByClassName("unsave");

        Array.prototype.forEach.call(els, function(el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
        });

        Array.prototype.forEach.call(el2s, function(el2) {
            el2.style.display = "block";
            el2.style.pointerEvents = "all";
        });
    });

    const hasSaved = Array.isArray(listings) && listings.length > 0;
    const hasOwn = Array.isArray(userListings) && userListings.length > 0;

    if (!hasSaved && !hasOwn) {
        return (
            <>
                <NavBar />
                <div className="page-wrapper">

                    <h1 id="userHello">Hello {username}!</h1>

                    <div className="account-actions">
                        <button className="primary-btn" onClick={() => navigate('/create-listing')}>
                            Create a Listing
                        </button>
                    </div>

                    <h2 id="saved-listings-header">Your saved Listings:</h2>
                        
                    <div id="center-div">
                        <FontAwesomeIcon icon={faSquareXmark} />
                        <p id="nosaved-listings">You Have No Saved Listings</p>
                    </div>
                </div>
                <Footer />
            </>


        )
    } else {
        return (
            <>
                <NavBar />

                <div className="account-page">
                    <h1 id="userHello">Hello {username}!</h1>

                    <div className="account-actions">
                        <button className="primary-btn" onClick={() => navigate('/create-listing')}>
                            Create a Listing
                        </button>
                    </div>

                    {hasOwn && (
                        <section className="account-section">
                            <h2 className="account-section-title">Your listings:</h2>
                            <div className='listings-wrapper account-grid'>
                                {userListings.map((listing, idx) => {
                                    const id = listing.listingId || listing.postNum || idx;
                                    const isDeleting = deletingId === id;
                                    return (
                                        <Listing
                                            key={listing.listingId || listing.link || idx}
                                            site={listing.site || 'e46finder.com'}
                                            link={listing.link}
                                            car={listing.car || listing.title}
                                            price={listing.price}
                                            picture={listing.picture || (Array.isArray(listing.images) ? listing.images[0] : '')}
                                            images={listing.images}
                                            description={listing.description}
                                            timeleft={listing.timeLeftText || listing.timeLeft || listing.expiresAt}
                                            expiresAt={listing.expiresAt}
                                            mileage={listing.mileage}
                                            location={listing.location}
                                            trans={listing.transmission || listing.trans}
                                            postNum={listing.postNum || listing.listingId || idx}
                                            listedBy={listing.listedBy || username}
                                            listingId={listing.listingId}
                                            hideSaveToggle={true}
                                            loggedInCookie={true}
                                            actionButtons={
                                                <div className="user-listing-actions">
                                                    <button
                                                        className="secondary-btn"
                                                        onClick={() => navigate(`/edit-listing/${id}`)}
                                                    >
                                                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                    </button>
                                                    <button
                                                        className="danger-btn"
                                                        disabled={isDeleting}
                                                        onClick={() => setConfirmId(id)}
                                                    >
                                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <section className="account-section">
                        <h2 className="account-section-title" id="saved-listings-header">Your saved Listings:</h2>

                        <div className='listings-wrapper account-grid'>
                            {loading ? (
                                hasSaved ? (
                                    listings.map((listing, idx) =>
                                        <Listing
                                            key={listing.listingId || listing.postNum || listing.link || idx}
                                            site={listing.site}
                                            link={listing.link}
                                            car={listing.car}
                                            price={listing.price}
                                            picture={listing.picture}
                                            timeleft={listing.timeleft || listing.timeLeft || listing.expiresAt}
                                            expiresAt={listing.expiresAt}
                                            mileage={listing.mileage}
                                            location={listing.location}
                                            trans={listing.transmission || listing.trans}
                                            postNum={listing.postNum || listing.listingId || idx}
                                            loggedInCookie={true}
                                        />
                                    )
                                ) : (
                                    <div className="saved-empty">
                                        <FontAwesomeIcon icon={faSquareXmark} />
                                        <p id="nosaved-listings">You Have No Saved Listings</p>
                                    </div>
                                )
                            ) :
                                <div id="loader-wrapper">
                                    <span className="loader"></span>
                                    <span>Loading Your Saved Listings</span>
                                </div>
                            }
                        </div>
                    </section>
                </div>

                <Footer />

                {confirmId && (
                    <div className="modal-backdrop">
                        <div className="modal-card">
                            <h3>Delete listing?</h3>
                            <p>This will permanently remove the listing.</p>
                            <div className="modal-actions">
                                <button
                                    className="ghost-btn"
                                    onClick={() => setConfirmId('')}
                                    disabled={!!deletingId}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="danger-btn"
                                    disabled={!!deletingId}
                                    onClick={async () => {
                                        if (!confirmId) return;
                                        setDeletingId(confirmId);
                                        try {
                                            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/userlistings/${confirmId}`, { withCredentials: true });
                                            setUserListings(prev => prev.filter(l => (l.listingId || l.postNum || '') !== confirmId));
                                        } catch (err) {
                                            console.error('Delete listing failed:', err);
                                        } finally {
                                            setDeletingId('');
                                            setConfirmId('');
                                        }
                                    }}
                                >
                                    {deletingId === confirmId ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>

        )
    }

}

export default Account
