/**
 * Listing card
 * Props come from either `/scrape` results (listings page) or `/accountpagesavedlistings` (account page).
 * Time handling:
 *  - When the source shows "N days", we render days mode.
 *  - When it switches to hh:mm:ss, render sub-day timer. If the listing is saved, notify the backend
 *    via `/savelisting/update` to persist a precise absolute expiration for TTL.
 */
import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useRef, useMemo } from 'react';

const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, mileage, location, trans, postNum, isAlreadySaved, loggedInCookie, description, listedBy, images, hideSaveToggle } = props;

    // Normalize time value to a robust string; strip common suffixes like "left"
    const rawTime = timeleft;
    let timeStr = typeof rawTime === 'string' ? rawTime : (rawTime ? String(rawTime) : '');
    timeStr = timeStr.trim();
    let norm = timeStr.toLowerCase().trim();
    if (norm.endsWith('left')) {
        // Remove trailing "left" while keeping the core time content
        timeStr = timeStr.slice(0, timeStr.toLowerCase().lastIndexOf('left')).trim();
        norm = timeStr.toLowerCase();
    }

    // Fallback flag for when we cannot parse time
    var setnotime = false;

    // Unified holders to avoid re-declaration warnings
    let timetill = 0;
    let days = false;
    let dayone = false;

    // Safely derive format checks from the normalized string
    const colonsInString = (timeStr.match(/:/g) || []).length;
    const dayMatch = norm.match(/(\d+)\s*day/);
    const oneday = !!dayMatch && (parseInt(dayMatch[1], 10) === 1);
    // Detect ISO date-like strings (e.g., 2025-01-31T12:34:56.000Z)
    const isISODate = /^\d{4}-\d{2}-\d{2}T/.test(timeStr) || /^\d{4}-\d{2}-\d{2}/.test(timeStr);

    // converts what ever the current time format is to milliseconds
    if (dayMatch) {
        const d = parseInt(dayMatch[1], 10) || 0;
        timetill = d * 86400000;
        days = true;
        dayone = d === 1;
    } else if (isISODate) {
        // For absolute expiry timestamps (saved listings), do not add an extra day.
        // This prevents +1 day display on Account page.
        const expiryMs = Date.parse(timeStr);
        const diff = isNaN(expiryMs) ? 0 : Math.max(0, expiryMs - Date.now());
        timetill = diff;
        days = diff >= 86400000;
        dayone = false;
    } else if (colonsInString === 2) {
        const parts = timeStr.split(':');
        const h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        const s = parseInt(parts[2], 10) || 0;
        timetill = h * 3600000 + m * 60000 + s * 1000;
        days = false;
        dayone = false;
    } else if (colonsInString === 1) {
        const parts = timeStr.split(':');
        const m = parseInt(parts[0], 10) || 0;
        const s = parseInt(parts[1], 10) || 0;
        timetill = m * 60000 + s * 1000;
        days = false;
        dayone = false;
    } else {
        // Unrecognized or missing time format; show fallback message
        setnotime = true;
        timetill = 0;
        days = false;
        dayone = false;
    };


    // Guard against NaN to avoid propagating invalid timestamps
    const parsedTill = Number.isFinite(timetill) ? timetill : parseInt(String(timetill));
    // Compute a stable absolute target timestamp (do not drift on re-render)
    const time = useMemo(() => {
        if (isISODate) {
            const expiryMs = Date.parse(timeStr);
            return isNaN(expiryMs) ? Date.now() : expiryMs;
        }
        return isNaN(parsedTill) ? Date.now() : (Date.now() + parsedTill);
        // Recompute only when the source text changes (e.g., days → hh:mm:ss)
    }, [timeStr, isISODate, parsedTill]);
    const justdays = days
    const justoneday = dayone
    const savedlisting = (isAlreadySaved === true) || isISODate;
    const displayLink = link || '#';
    const displaySite = site || 'e46finder.com';
    const primaryImage = picture || (Array.isArray(images) ? images[0] : '');
    const descriptionText = (description || '').trim();
    const listedByText = listedBy || '';

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
            {!hideSaveToggle && (
                <div id={`listing${postNum}`}>
                    <Tooltip title="Click here to save this listing for later!" arrow>
                        <button id='save-listing' className='save' onClick={save}><FontAwesomeIcon icon={faBookmark} /></button>
                    </Tooltip>
                    <Tooltip title="Click to unsave this listing." arrow>
                        <button id="unsave-listing" className='unsave' onClick={save}><FontAwesomeIcon icon={faRectangleXmark} /></button>
                    </Tooltip>
                </div>
            )}
            
            <a href={displayLink}>
                <img src={primaryImage} alt="listing"></img>
                <h4>{car}</h4>
                <p>TRANSMISSION: {trans}</p>
                <p>MILEAGE: {mileage}</p>
                <p>PRICE: {price}</p>
                {descriptionText && (
                    <p className='listing-description' title={descriptionText}>
                        {descriptionText.length > 140 ? `${descriptionText.slice(0, 140)}...` : descriptionText}
                    </p>
                )}
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
                    <h4><span>Listed On: </span><span className='listingsite'>{displaySite}</span></h4>
                    {listedByText && (
                        <p className='listedby'>Listed by {listedByText}</p>
                    )}
                </div>
            </a>
        </div>
    )

};

export default Listing;
