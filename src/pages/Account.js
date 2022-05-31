import axios from "axios"
import NavBar from "../componets/NavBar/NavBar"
import Footer from '../componets/Footer/Footer'
import Listing from '../componets/Listings/Listing'
import '../css/Account.css'
import { useEffect, useState } from 'react';

function Account() {

    const [username, setUsername] = useState();
    const [listings, setListings] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchUsername = async () => {
        axios.get('http://localhost:5000/accountpageusername', { withCredentials: true })
        
          .then(res => {
              setUsername(res.data)
          })
  
      };
  
      fetchUsername()
    }, []);

    const grabListings = async () => {

        try {
            var grabListingsData = await (await axios.get('http://localhost:5000/accountpagesavedlistings', { withCredentials: true })).data
            setListings(grabListingsData)
            setLoading(true);
            
        } catch (err) {
            console.log(err);
        };

    };

    useEffect(() => {
        grabListings();
    }, []);


    return (
        <div>
            <NavBar />

            <h1 id="userHello">Hello {username}!</h1>

            <h4>Your saved Listings</h4>
            <div className='listings-wrapper'>
                {loading ? (listings.map((listing) =>
                    <Listing
                        key={listing.link}
                        site={listing.site}
                        link={listing.link}
                        car={listing.car}
                        price={listing.price}
                        picture={listing.picture}
                        timeleft={listing.timeleft}
                        mileage={listing.mileage}
                        location={listing.location}
                        trans={listing.transmission}
                    />
                )) :
                    <div id="loader-wrapper">
                        <span className="loader"></span>
                        <span>Loading Your Saved Listings</span>
                    </div>
                }
            </div>


            <Footer />
        </div>

        
    )
}

export default Account
