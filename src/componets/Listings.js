import axios from 'axios'
import Listing from './Listing'
import { useState, useEffect, Link } from 'react'

const Listings = () => {

    let [listings, setListings] = useState([]);


    const grabListings = async () => {

        try {
            var grabListingsData = await (await axios.get('http://localhost:5000/scrape')).data
            setListings(grabListingsData)
        } catch (err) {
            console.log(err);
        };

    };

    useEffect(() => {
        grabListings();
    }, []);


    return (
        <>
            <h1> Listings </h1>
            <div className='listings-wrapper'>
                {listings.map((listing) => 
                    <Listing key={listing.link} link={listing.link} car={listing.car} price={listing.price} picture={listing.picture}/>
                )}
            </div>
        </>
    )



}

export default Listings