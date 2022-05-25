import CountdownTimer from './CountDown';
const Listing = (props) => {
    var { link, car, price, picture, timeleft, site, milage, location, trans } = props;


    var startOfTime = timeleft.endsWith('days')
    


    if (startOfTime) {
        var daysleft = timeleft
        .split(' ')[0] * 86400000;
        var timetill = daysleft + 86400000;
        var days = true;
    } else if (startOfTime !== 'days') {
        // Handles count Down 
        var secondesLeft = timeleft
            .split(':')[2] * 1000;

        var minutesLeft = timeleft
            .split(':')[1] * 60000;

        var hoursLeft = timeleft
            .split(':')[0] * 3600000;

        timetill = hoursLeft + minutesLeft + secondesLeft
        days = false
    }


    const time = Date.now() + timetill
    const justdays = days

    return (
        <div className='listing-contanier'>
            <a href={link}>
                <img src={picture} alt="listing"></img>
                <CountdownTimer
                className="countdown"
                    countdownTimestampMs={time}
                    justdays={justdays}
                />
                <p>{site}</p>
                <p>{car}</p>
                <p>{price}</p>
                <p>{milage}</p>
                <p>{location}</p>
                <p>{trans}</p>
            </a>
        </div>
    )
};

export default Listing;
