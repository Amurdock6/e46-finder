import CountdownTimer from './CountDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'

const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, mileage, location, trans, postNum, isAlreadySaved, loggedInCookie  } = props;

    var startOfTime = timeleft.endsWith('days')
    var oneday = timeleft.endsWith('day')
    var colonsInString = (timeleft.match(/:/g) || []).length;
    var isMillisecond = timeleft.startsWith('2022-');

// converts what ever the current time format is to milliseconds    
    if (startOfTime) {
        var daysleft = timeleft
        .split(' ')[0] * 86400000;
        var timetill = daysleft + 86400000;
        var days = true;
    } else if (isMillisecond) {
        days = timeleft
            .slice(8, 10) * 86400000;

        var hours = timeleft
            .slice(11, 13) * 3600000;

        var minutes = timeleft
            .slice(14, 16) * 60000;

        var secondes = timeleft
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
            var setnotime = true
        }

        timetill = days + hours + minutes + secondes;


        var saved = true;
    } else if (oneday === true) { 
        var dayone = true
        timetill = daysleft + 86400000;
    }
    else if (colonsInString === 2) {
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


    const time = Date.now() + parseInt(timetill)
    const justdays = days
    const justoneday = dayone
    const savedlisting = saved;


    let navigate = useNavigate(); 

    function setSaved() {
        console.log("Saved listing")
        var el = document.querySelector(`#listing${postNum}:first-child #save-listing`);
        el.style.display = "none";
        el.style.pointerEvents = "none";

        var el2 = document.querySelector(`#listing${postNum}:nth-child(1) #unsave-listing`);
        el2.style.display = "block";
        el2.style.pointerEvents = "all";
    }

    function setDelete() {
        console.log("Delted listing")

        var el = document.querySelector(`#listing${postNum}:first-child #save-listing`);
        el.style.display = "block";
        el.style.pointerEvents = "all";

        
        var el2 = document.querySelector(`#listing${postNum}:nth-child(1) #unsave-listing`);
        el2.style.display = "none";
        el2.style.pointerEvents = "none";
    }


    const save = async () => {
        // counter on back end is not working
        if (loggedInCookie) {
            try {
                const data = await axios("http://localhost:5000/savelisting", {
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

                if (data.status === 200) {
                    setSaved(postNum);
                }   
            } catch (err) {
                if (err.message === 'Request failed with status code 409') {
                    setDelete(postNum);
                }

                if (err.message === 'Request failed with status code 404') {
                    setDelete(postNum);
                }
                
                console.log(err)
            }

        } else {
            navigate('/login');
        };

    };

    useEffect(() => {
        if (isAlreadySaved === true) {
            setSaved();
        };
    },);
    
    return (
        <div className='listing-contanier'>
            <div id={`listing${postNum}`}>
                <Tooltip title="Click here to save this listing for latter!" arrow>
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
                    timeleft={timeleft}
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
