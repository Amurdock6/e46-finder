import dayjs from 'dayjs';

// Function to calculate the remaining time until a given timestamp (in milliseconds)
export function getRemainingTimeUntilMsTimestamp(timestampMs) {
    // Convert the input timestamp to a Dayjs object
    const now = dayjs();
    // Get the current time as a Dayjs object
    const expiration = dayjs(timestampMs);
    const diffMs = expiration.diff(now);

    // If the timestamp is in the past, return zeros
    if (diffMs <= 0) {
        return {
            seconds: '00',
            minutes: '00',
            hours: '00',
            days: '00'
        };
    }

    // If the remaining time is 24 hours or more, use Math.ceil to round up days.
    if (diffMs > 86400000) {
        return {
            seconds: padWithZeros(expiration.diff(now, 'seconds') % 60, 2),
            minutes: padWithZeros(expiration.diff(now, 'minutes') % 60, 2),
            hours: padWithZeros(expiration.diff(now, 'hours') % 24, 2),
            days: Math.ceil(diffMs / 86400000).toString()
        };
    } else {
        // For less than a day, return 0 days and use the regular hours/minutes/seconds
        return {
            seconds: padWithZeros(expiration.diff(now, 'seconds') % 60, 2),
            minutes: padWithZeros(expiration.diff(now, 'minutes') % 60, 2),
            hours: padWithZeros(expiration.diff(now, 'hours') % 24, 2),
            days: '0'
        };
    }
}

// Function to pad numbers with leading zeros to reach a minimum length
function padWithZeros(number, minLength) {
    // Convert the number to a string
    const numberString = number.toString();

    // If the number already meets or exceeds the minimum length, return it as is
    if (numberString.length >= minLength) {
        return numberString;
    } 

    // Otherwise, pad the number with leading zeros
    return "0".repeat(minLength - numberString.length) + numberString;
}