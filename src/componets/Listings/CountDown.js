/**
 * CountdownTimer
 * - Drives the visual countdown from a future timestamp (ms).
 * - Modes:
 *   - justdays: shows only days (prefers source text when available for parity with listing site).
 *   - justoneday: shows a static label provided by parent when exactly one day remains.
 *   - default (sub-day): shows hh:mm:ss.
 */
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
    // If time can't be parsed or is missing, show a helpful fallback
    if (props.setnotime) {
        return (
            <div className="countdown-timer">
                <span> Time Left: </span>
                <span>Check Listing Site For Details</span>
            </div>
        );
    }

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
        // Prefer the day count from the original text (e.g., "2 days left")
        // to match the source site exactly; fallback to computed value.
        const raw = String(props.timeleft || '').toLowerCase();
        const match = raw.match(/(\d+)\s*day/);
        const fromText = match ? parseInt(match[1], 10) : NaN;
        const daysValue = Number.isFinite(fromText) && fromText > 0
            ? fromText
            : parseInt(remainingTime.days, 10);
        return (
            <div className="countdown-timer">
                <span> Ends In: </span>
                <span>{daysValue}</span>
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
