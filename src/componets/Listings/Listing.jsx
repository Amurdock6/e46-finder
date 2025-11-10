import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, mileage, location, trans, postNum, isAlreadySaved, loggedInCookie } = props;

    // Normalize time value to a string to avoid calling string methods on undefined/null
    var timeStr = typeof timeleft === 'string' ? timeleft : '';

    // Fallback flag for when we cannot parse time
    var setnotime = false;

    // Safely derive format checks from the normalized string
    var startOfTime = timeStr.endsWith('days')
    var oneday = timeStr.endsWith('day')
    var colonsInString = (timeStr.match(/:/g) || []).length;
    var isMillisecond = timeStr.startsWith('2022-'); //  Backend bug with count down might be coming from here.

    // converts what ever the current time format is to milliseconds    
    if (startOfTime) {
        var daysleft = timeStr
        .split(' ')[0] * 86400000;
        var timetill = daysleft + 86400000;
        var days = true;
    } else if (isMillisecond) {
        days = timeStr
            .slice(8, 10) * 86400000;

        var hours = timeStr
            .slice(11, 13) * 3600000;

        var minutes = timeStr
            .slice(14, 16) * 60000;

        var secondes = timeStr
            .slice(17, 19) * 1000;

        var timeuntilexperation = days + hours + minutes + secondes

        if(timeuntilexperation === 86400000){
            hours = 86400000
            minutes = 0
            secondes = 0
        }

        if (timeuntilexperation < 25200000){
            days = 0
            hours = 43200000
            minutes = 0
            secondes = 0
        }

        if (timeuntilexperation <= 172800000) {
            setnotime = true
        }

        timetill = days + hours + minutes + secondes;


        var saved = true;
    } else if (oneday === true) { 
        var dayone = true
        timetill = daysleft + 86400000;
    }
    else if (colonsInString === 2) {
        var secondesLeft = timeStr
            .split(':')[2] * 1000;

        var minutesLeft = timeStr
            .split(':')[1] * 60000;

        var hoursLeft = timeStr
            .split(':')[0] * 3600000;

        timetill = hoursLeft + minutesLeft + secondesLeft
        days = false
        dayone = false
    } else if (colonsInString === 1) {
         secondesLeft = timeStr
            .split(':')[1] * 1000;

         minutesLeft = timeStr
            .split(':')[0] * 60000;

        timetill = minutesLeft + secondesLeft
        days = false
        dayone = false
    } else {
        // Unrecognized or missing time format; show fallback message
        setnotime = true;
        var timetill = 0;
        var days = false;
        var dayone = false;
    };


    // Guard against NaN to avoid propagating invalid timestamps
    const parsedTill = parseInt(timetill);
    const time = isNaN(parsedTill) ? Date.now() : Date.now() + parsedTill
    const justdays = days
    const justoneday = dayone
    const savedlisting = saved;


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
