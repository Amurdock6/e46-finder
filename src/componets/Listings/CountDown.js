import { useState, useEffect } from 'react';
import { getRemainingTimeUntilMsTimestamp } from './CountDownTimerUtils';

// Default remaining time values when the timer hasn't started yet
const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00',
    days: '00'
};

const CountdownTimer = (props) => {
    // State to hold the remaining time, initialized with default values
    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    // useEffect hook to update the remaining time every second
    useEffect(() => {
        // Set up an interval to update the remaining time every 1000 milliseconds (1 second)
        const intervalId = setInterval(() => {
            updateRemainingTime(props.countdownTimestampMs);
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts or when the dependency changes
        return () => clearInterval(intervalId);
    }, [props.countdownTimestampMs]); // Dependency array includes the countdown timestamp

    // Function to update the remaining time state
    function updateRemainingTime(countdown) {
        // Calculate the new remaining time and update the state
        setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
    }

    // Conditional rendering based on the props passed to the component

    // If 'justoneday' prop is true, display a specific message
    if (props.justoneday === true) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span>{props.timeleft}</span>
            </div>
        );
    }

    // If 'justdays' prop is true, display only the remaining days
    if (props.justdays === true) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span>{remainingTime.days}</span>
                <span> days</span>
            </div>
        );
    }

    // If 'justdays' prop is false, display hours, minutes, and seconds
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
        );
    }

    // If 'savedlisting' prop is true, display different messages based on the remaining days
    if (props.savedlisting === true) {
        if (remainingTime.days > 1) {
            // If more than one day remains, display the number of days left
            return (
                <div className="countdown-timer">
                    <span> Ends In: </span>
                    <span>{remainingTime.days}</span>
                    <span> days</span>
                </div>
            );
        } else if (remainingTime.days === 1) {
            // If exactly one day remains, display the 'timeleft' prop
            return (
                <div className="countdown-timer">
                    <span> Ends In: </span>
                    <span>{props.timeleft}</span>
                </div>
            );
        } else {
            // If no days remain, prompt the user to check the listing site
            return (
                <div className="countdown-timer">
                    <span> Time Left: </span>
                    <span>Check Listing Site For Details</span>
                </div>
            );
        }
    }

    // Default return if none of the conditions above are met
    return (
        <div className="countdown-timer">
            error
        </div>
    );
};

export default CountdownTimer;
