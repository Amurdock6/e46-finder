import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';

const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, mileage, location, trans, postNum, isAlreadySaved, loggedInCookie } = props;

    // Normalize time value to a string to avoid calling string methods on undefined/null
    var timeStr = typeof timeleft === 'string' ? timeleft : '';

    // Fallback flag for when we cannot parse time
    var setnotime = false;

    // Unified holders to avoid re-declaration warnings
    let timetill = 0;
    let days = false;
    let dayone = false;

    // Safely derive format checks from the normalized string
    var startOfTime = timeStr.endsWith('days')
    var oneday = timeStr.endsWith('day')
    var colonsInString = (timeStr.match(/:/g) || []).length;
    // Detect ISO date-like strings (e.g., 2025-01-31T12:34:56.000Z)
    var isISODate = /^\d{4}-\d{2}-\d{2}/.test(timeStr);

    // converts what ever the current time format is to milliseconds    
    if (startOfTime) {
        const daysleft = timeStr
        .split(' ')[0] * 86400000;
        timetill = daysleft + 86400000;
        days = true;
    } else if (isISODate) {
        // Use absolute expiry. Match list-page days semantics by adding one-day buffer for days view.
        const expiryMs = Date.parse(timeStr);
        const diff = isNaN(expiryMs) ? 0 : Math.max(0, expiryMs - Date.now());
        if (diff >= 86400000) {
            timetill = diff + 86400000; // align with "days" rounding seen on listings page
            days = true;
        } else {
            timetill = diff;
            days = false;
        }
        dayone = false;
    } else if (oneday === true) { 
        dayone = true
        timetill = 86400000;
    }
    else if (colonsInString === 2) {
        const secondesLeft = timeStr
            .split(':')[2] * 1000;

        const minutesLeft = timeStr
            .split(':')[1] * 60000;

        const hoursLeft = timeStr
            .split(':')[0] * 3600000;

        timetill = hoursLeft + minutesLeft + secondesLeft
        days = false
        dayone = false
    } else if (colonsInString === 1) {
         let secondesLeft = timeStr
            .split(':')[1] * 1000;

         let minutesLeft = timeStr
            .split(':')[0] * 60000;

        timetill = minutesLeft + secondesLeft
        days = false
        dayone = false
    } else {
        // Unrecognized or missing time format; show fallback message
        setnotime = true;
        timetill = 0;
        days = false;
        dayone = false;
    };


    // Guard against NaN to avoid propagating invalid timestamps
    const parsedTill = Number.isFinite(timetill) ? timetill : parseInt(String(timetill));
    const time = isNaN(parsedTill) ? Date.now() : Date.now() + parsedTill
    const justdays = days
    const justoneday = dayone
    const savedlisting = (isAlreadySaved === true) || isISODate;


    let navigate = useNavigate(); 

    const setSaved = useCallback(() => {
        var el = document.querySelector(`#listing${postNum}:first-child #save-listing`);
        if (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
        }
    
        var el2 = document.querySelector(`#listing${postNum}:nth-child(1) #unsave-listing`);
        if (el2) {
            el2.style.display = "block";
            el2.style.pointerEvents = "all";
        }
    }, [postNum]);

    function setDelete() {

        var el = document.querySelector(`#listing${postNum}:first-child #save-listing`);
        el.style.display = "block";
        el.style.pointerEvents = "all";

        
        var el2 = document.querySelector(`#listing${postNum}:nth-child(1) #unsave-listing`);
        el2.style.display = "none";
        el2.style.pointerEvents = "none";
    }


    const save = async () => {
        if (loggedInCookie) {
            try {
                const res = await axios(`${process.env.REACT_APP_BACKEND_URL}/savelisting`, {
                    method: "post",
                    data: {
                        link: link,
                        car: car,
                        price: price,
                        picture: picture,
                        timeleft: timeleft,
                        site: site,
                        mileage: mileage,
                        location: location,
                        trans: trans,
                        postNum: postNum
                    },
                    withCredentials: true
                });

                if (res.status === 200) {
                    const action = res?.data?.action;
                    if (action === 'saved') {
                        setSaved(postNum);
                    } else if (action === 'removed') {
                        setDelete(postNum);
                    }
                }
            } catch (err) {
                console.error('Save/Unsave failed:', err);
            }
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (isAlreadySaved === true) {
            setSaved();
        };
    }, [isAlreadySaved, setSaved]);    

    // When a listing is already saved and the source switches to hh:mm:ss,
    // notify backend to update the absolute expiration for TTL accuracy.
    const didRequestUpdate = useRef(false);
    useEffect(() => {
        const hasColonTime = (timeStr.match(/:/g) || []).length >= 1;
        if (!loggedInCookie) return;
        if (!isAlreadySaved) return;
        if (!hasColonTime) return;
        if (didRequestUpdate.current) return;

        (async () => {
            try {
                await axios(`${process.env.REACT_APP_BACKEND_URL}/savelisting/update`, {
                    method: "post",
                    data: {
                        link: link,
                        postNum: postNum,
                        timeleft: timeStr
                    },
                    withCredentials: true
                });
                didRequestUpdate.current = true;
            } catch (e) {
                // Silently ignore if backend endpoint isn't available yet
                // or returns a non-200 while backend changes roll out.
            }
        })();
    }, [loggedInCookie, isAlreadySaved, timeStr, link, postNum]);
    
    return (
        <div className='listing-contanier'>
            <div id={`listing${postNum}`}>
                <Tooltip title="Click here to save this listing for later!" arrow>
                    <button id='save-listing' className='save' onClick={save}><FontAwesomeIcon icon={faBookmark} /></button>
                </Tooltip>
                <Tooltip title="Click to unsave this listing." arrow>
                    <button id="unsave-listing" className='unsave' onClick={save}><FontAwesomeIcon icon={faRectangleXmark} /></button>
                </Tooltip>
            </div> 
            
            <a href={link}>
                <img src={picture} alt="listing"></img>
                <h4>{car}</h4>
                <p>TRANSMISSION: {trans}</p>
                <p>MILEAGE: {mileage}</p>
                <p>PRICE: {price}</p>
                <CountdownTimer
                    countdownTimestampMs={time}
                    justdays={justdays}
                    justoneday={justoneday}
                    timeleft={timeStr}
                    savedlisting={savedlisting}
                    setnotime={setnotime}
                />
                <p className='location'>LOCATION: {location}</p>
                <div className='listedon'>
                    <h4><span>Listed On: </span><span className='listingsite'>{site}</span></h4>
                </div>
            </a>
        </div>
    )

};

export default Listing;
