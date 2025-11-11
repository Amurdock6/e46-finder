import axios from "axios"
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import Listing from '../componets/Listings/Listing'
import '../css/Account.css'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';

function Account() {

    const [username, setUsername] = useState();
    const [listings, setListings] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsername = async () => {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/accountpageusername`, { withCredentials: true })

                .then(res => {
                    setUsername(res.data)
                },)

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
        var els = document.getElementsByClassName("save");
        var el2s = document.getElementsByClassName("unsave");

        Array.prototype.forEach.call(els, function (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
        });

        Array.prototype.forEach.call(el2s, function (el2) {
            el2.style.display = "block";
            el2.style.pointerEvents = "all";
        });
    });

    if (!listings || listings.length === 0) {
        return (
            <>
                <NavBar />
                <div className="page-wrapper">

                    <h1 id="userHello">Hello {username}!</h1>

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
            <div>
                <NavBar />

                <h1 id="userHello">Hello {username}!</h1>

                <h2 id="saved-listings-header">Your saved Listings:</h2>

                <div className='listings-wrapper'>
                    {loading ? (
                        listings.map((listing) =>
                            <Listing
                                key={listing.listingId}             // Use listingId as key
                                listingId={listing.listingId}         // Pass the unique id
                                site={listing.site}
                                link={listing.link}
                                car={listing.car}
                                price={listing.price}
                                picture={listing.picture}
                                expiresAt={listing.expiresAt}         // Pass the expiration date
                                timeLeftText={listing.timeLeftText}   // Pass the original scraped time text
                                mileage={listing.mileage}
                                location={listing.location}
                                transmission={listing.transmission}   // Use 'transmission' not 'trans'
                                loggedInCookie={true}
                            />
                        )
                    ) : (
                        <div id="loader-wrapper">
                            <span className="loader"></span>
                            <span>Loading Your Saved Listings</span>
                        </div>
                    )}
                </div>


                <Footer />
            </div>

        )
    }

}

export default Account
