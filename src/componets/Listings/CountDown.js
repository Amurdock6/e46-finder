import { useState, useEffect } from 'react';
import { getRemainingTimeUntilMsTimestamp } from './CountDownTimerUtils';

const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00',
    days: '00'
}

const CountdownTimer = (props) => {

    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime(props.countdownTimestampMs);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [props.countdownTimestampMs]);

    function updateRemainingTime(countdown) {
        setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
    }


    if (props.justoneday === true) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span>{props.timeleft}</span>
            </div>
        );
    }

    if (props.justdays === true) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span>{remainingTime.days}</span>
                <span> days</span>
            </div>
        );
    }


    if (props.justdays === false) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span className="two-numbers">{remainingTime.hours}</span>
                <span>:</span>
                <span className="two-numbers">{remainingTime.minutes}</span>
                <span>:</span>
                <span className="two-numbers">{remainingTime.seconds}</span>
            </div>
        )
    }

    if (props.savedlisting) {
        if(remainingTime.days > 1) {
            return (
                <div className="countdown-timer">
                    <span> Ends In: </span>
                    <span>{remainingTime.days}</span>
                    <span> days</span>
                </div>
            );
        } else if (remainingTime.days === 1) {
            return (
                <div className="countdown-timer">
                    <span> Ends In: </span>
                    <span>{props.timeleft}</span>
                </div>
            );
        } else {
        return (
            <div className="countdown-timer">
                <span className="two-numbers">{remainingTime.hours}</span>
                <span>:</span>
                <span className="two-numbers">{remainingTime.minutes}</span>
                <span>:</span>
                <span className="two-numbers">{remainingTime.seconds}</span>
            </div>
        )
        }
    }

    return (
        <div className="countdown-timer">
            error
        </div>
    )

}


export default CountdownTimer;