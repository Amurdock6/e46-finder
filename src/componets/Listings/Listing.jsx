import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';

const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, milage, location, trans } = props;

    var startOfTime = timeleft.endsWith('days')
    var oneday = timeleft.endsWith('day')
    var colonsInString = (timeleft.match(/:/g) || []).length;
    
    if (startOfTime) {
        var daysleft = timeleft
        .split(' ')[0] * 86400000;
        var timetill = daysleft + 86400000;
        var days = true;
    } else if (oneday === true) { 
        var dayone = true
        timetill = daysleft + 86400000;
    }
    else if (colonsInString === 2) {
        // Handles count Down 
        var secondesLeft = timeleft
            .split(':')[2] * 1000;

        var minutesLeft = timeleft
            .split(':')[1] * 60000;

        var hoursLeft = timeleft
            .split(':')[0] * 3600000;

        timetill = hoursLeft + minutesLeft + secondesLeft
        days = false
        dayone = false
    } else if (colonsInString === 1) {
         secondesLeft = timeleft
            .split(':')[1] * 1000;

         minutesLeft = timeleft
            .split(':')[0] * 60000;

        timetill = minutesLeft + secondesLeft
        days = false
        dayone = false
    };


    const time = Date.now() + timetill
    const justdays = days
    const justoneday = dayone

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

    const save = async () => {
        if (loggedInCookie) {
            await axios("http://localhost:5000/savelisting", {
                method: "post",
                data: {
                    link: link,
                    car: car,
                    price: price,
                    picture: picture,
                    timeleft: timeleft,
                    site: site,
                    milage: milage,
                    location: location,
                    trans: trans
                },
                withCredentials: true
            });

        } else {
            console.log("please login to save this listing")
        };

    };



    return (
        <div className='listing-contanier'>

            <Tooltip title="Click here to save this listing for latter!" arrow>
                <button id="save-listing" onClick={save}><FontAwesomeIcon icon={faBookmark} /></button>
            </Tooltip>
            <a href={link}>
                <img src={picture} alt="listing"></img>
                <h4>{car}</h4>
                <p>TRANSMISSION: {trans}</p>
                <p>MILEAGE: {milage}</p>
                <p>PRICE: {price}</p>
                <CountdownTimer
                    countdownTimestampMs={time}
                    justdays={justdays}
                    justoneday={justoneday}
                    timeleft={timeleft}
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
