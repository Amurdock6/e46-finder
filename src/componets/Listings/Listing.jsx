import CountdownTimer from './CountDown';
const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, milage, location, trans } = props;


    var startOfTime = timeleft.endsWith('days')
    var oneday = timeleft.endsWith('day')
    


    if (startOfTime) {
        var daysleft = timeleft
        .split(' ')[0] * 86400000;
        var timetill = daysleft + 86400000;
        var days = true;
    } else if (oneday === true) { 
        var dayone = true
        timetill = daysleft + 86400000;
    }else if (startOfTime !== 'days') {
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
    }


    const time = Date.now() + timetill
    const justdays = days
    const justoneday = dayone

    return (
        <div className='listing-contanier'>
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
