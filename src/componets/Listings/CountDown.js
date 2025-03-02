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
    function updateRemainingTime(timestampMs) {
        // Calculate the new remaining time and update the state
        setRemainingTime(getRemainingTimeUntilMsTimestamp(timestampMs));
    }

    // If expired, show a message
    if (
        remainingTime.days === '00' &&
        remainingTime.hours === '00' &&
        remainingTime.minutes === '00' &&
        remainingTime.seconds === '00'
    ) {
        return (
            <div className="countdown-timer">
                <span>Expired</span>
            </div>
        );
    }

    // If the original scraped time text indicates a day-based format
    // and our computed days value is less than 1 (due to time passing),
    // then force the display to "1 day".
    if (
        props.timeLeftText &&
        props.timeLeftText.toLowerCase().includes('day') &&
        parseInt(remainingTime.days, 10) < 1
      ) {
        return (
          <div className="countdown-timer">
            <span> Ends In: </span>
            <span>1 day</span>
          </div>
        );
      }

    // Show HH:MM:SS if less than one day remains
    if (parseInt(remainingTime.days, 10) < 1) {
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span className="two-numbers">
                    {`${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`}
                </span>
            </div>
        );
    }

    // Otherwise, display whole days left (truncate decimals)
    return (
        <div className="countdown-timer">
            <span> Ends In: </span>
            <span>{parseInt(remainingTime.days, 10)}</span>
            <span> day{parseInt(remainingTime.days, 10) !== 1 ? "s" : ""}</span>
        </div>
    );
};

export default CountdownTimer;