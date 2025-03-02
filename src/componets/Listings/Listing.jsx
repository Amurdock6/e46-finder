import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react'

const Listing = (props) => {
    const {
        link,
        car,
        price,
        picture,
        expiresAt,         // Must be a valid ISO string or date string from backend
        site,
        mileage,
        location,
        transmission,
        listingId,
        isAlreadySaved,
        loggedInCookie
    } = props;

    // Convert expiresAt to a timestamp (milliseconds)
    const countdownTimestampMs = new Date(expiresAt).getTime();

    let navigate = useNavigate();

    // Function to update the visual state when a listing is saved.
    const setSaved = useCallback(() => {
        const el = document.querySelector(`#listing${listingId} #save-listing`);
        if (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
        }
        const el2 = document.querySelector(`#listing${listingId} #unsave-listing`);
        if (el2) {
            el2.style.display = "block";
            el2.style.pointerEvents = "all";
        }
    }, [listingId]);


    const setDelete = () => {
        const el = document.querySelector(`#listing${listingId} #save-listing`);
        if (el) {
            el.style.display = "block";
            el.style.pointerEvents = "all";
        }
        const el2 = document.querySelector(`#listing${listingId} #unsave-listing`);
        if (el2) {
            el2.style.display = "none";
            el2.style.pointerEvents = "none";
        }
    };

    // Save/Unsave action: use the listingId (pointer) for saving.
    const save = async () => {
        if (loggedInCookie) {
            try {
                const data = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/savelisting`,
                    { listingId }, // Send only the pointer
                    { withCredentials: true }
                );
                if (data.status === 200) {
                    setSaved();
                }
            } catch (err) {
                if (
                    err.response &&
                    (err.response.status === 409 || err.response.status === 404)
                ) {
                    setDelete();
                }
            }
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (isAlreadySaved) {
            setSaved();
        }
    }, [isAlreadySaved, setSaved]);

    // Fallback if the timestamp is not a valid number
    if (isNaN(countdownTimestampMs)) {
        return (
            <div className="listing-contanier">
                <p>Error: Invalid expiration time.</p>
            </div>
        );
    }

    return (
        <div className='listing-contanier'>
            <div id={`listing${listingId}`}>
                <Tooltip title="Click here to save this listing for later!" arrow>
                    <button id='save-listing' className='save' onClick={save}>
                        <FontAwesomeIcon icon={faBookmark} />
                    </button>
                </Tooltip>
                <Tooltip title="Click to unsave this listing." arrow>
                    <button id='unsave-listing' className='unsave' onClick={save}>
                        <FontAwesomeIcon icon={faRectangleXmark} />
                    </button>
                </Tooltip>
            </div>

            <a href={link}>
                <img src={picture} alt="listing" />
                <h4>{car}</h4>
                <p>TRANSMISSION: {transmission}</p>
                <p>MILEAGE: {mileage}</p>
                <p>PRICE: {price}</p>
                <CountdownTimer
                    countdownTimestampMs={countdownTimestampMs}
                    timeLeftText={props.timeLeftText}
                />
                <p className='location'>LOCATION: {location}</p>
                <div className='listedon'>
                    <h4>
                        <span>Listed On: </span>
                        <span className='listingsite'>{site}</span>
                    </h4>
                </div>
            </a>
        </div>
    );
};

export default Listing;