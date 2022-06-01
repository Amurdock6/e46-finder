import axios from 'axios'
import Listing from './Listing'
import '../../css/Listing.css'
import { useState, useEffect } from 'react'

const Listings = () => {

    let [listings, setListings] = useState([]);
    let [savedListing, setSavedListings] = useState([]);
    const [loading, setLoading] = useState(false);

// Grabs the Listings from the Backend
    const grabListings = async () => {

        try {
            var grabListingsData = await (await axios.get('http://localhost:5000/scrape')).data
            setListings(grabListingsData)
            setLoading(true);
        } catch (err) {
            console.log(err);
        };

    };

    useEffect(() => {
        grabListings();
    }, []);

    const grabSavedListings = async () => {

        try {
            var grabSavedListingsData = await (await axios.get('http://localhost:5000/accountpagesavedlistings', { withCredentials: true })).data
            setSavedListings(grabSavedListingsData)

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




    // Checks to see if user has already saved listings
    if (loggedInCookie) {
        // get postNum from DB and sends param to listing.jsx that says already saved or not


        // need to compare these two map values
        listings.map((listing) =>
            console.log(listing.postNum)
        );

        savedListing.map((saved) =>
            console.log(saved.postNum)
        );


        // if (listing.postNum === parseInt(saved.postNum)) {
        //     var isAlreadySaved = true
        //     console.log("match")

        //     // console.log(isAlreadySaved)
        // }
    }


    return (
        <>
            <h1 id='listings-header'> Listings </h1>
            <div className='listings-wrapper'>
                {loading ? (listings.map((listing) =>
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
                        // isAlreadySaved={false}
                        loggedInCookie={loggedInCookie}
                    />

                )) : 
                <div id="loader-wrapper">
                    <span className="loader"></span> 
                    <span>Loading Listings This Could Take a Minute...</span>
                </div> 
                }
            </div>
            
        </>
    )

}

export default Listings