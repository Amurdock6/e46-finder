import dayjs from 'dayjs';

// Function to calculate the remaining time until a given timestamp (in milliseconds)
export function getRemainingTimeUntilMsTimestamp(timestampMs) {
    // Convert the input timestamp to a Dayjs object
    const timestampDayjs = dayjs(timestampMs);
    // Get the current time as a Dayjs object
    const nowDayjs = dayjs();

    // If the timestamp is in the past, return zeros for all time units
    if(timestampDayjs.isBefore(nowDayjs)) {
        return {
            seconds: '00',
            minutes: '00',
            hours: '00',
            days: '00'
        }
    }
   
    // If the remaining days are less than 2, calculate and return the precise remaining time
    if(getRemainingDays(nowDayjs, timestampDayjs) < 2){
        return {
            seconds : getRemainingSeconds(nowDayjs, timestampDayjs),
            minutes : getRemainingMinutes(nowDayjs, timestampDayjs),
            hours : getRemainingHours(nowDayjs, timestampDayjs),
            days : getRemainingDays(nowDayjs, timestampDayjs)
        } ;
    }

    // For remaining days 2 or more, still calculate and return the remaining time
    return {
        seconds : getRemainingSeconds(nowDayjs, timestampDayjs),
        minutes : getRemainingMinutes(nowDayjs, timestampDayjs),
        hours : getRemainingHours(nowDayjs, timestampDayjs),
        days : getRemainingDays(nowDayjs, timestampDayjs)
    } ;
}

// Helper function to calculate remaining seconds
function getRemainingSeconds(nowDayjs, timestampDayjs) {
    // Calculate total remaining seconds and get the remainder modulo 60
    const seconds = timestampDayjs.diff(nowDayjs, 'seconds') % 60;
    // Pad the result with leading zeros if necessary
    return padWithZeros(seconds, 2);
}

// Helper function to calculate remaining minutes
function getRemainingMinutes(nowDayjs, timestampDayjs) {
    // Calculate total remaining minutes and get the remainder modulo 60
    const minutes = timestampDayjs.diff(nowDayjs, 'minutes') % 60;
    // Pad the result with leading zeros if necessary
    return padWithZeros(minutes, 2);
}

// Helper function to calculate remaining hours
function getRemainingHours(nowDayjs, timestampDayjs) {
    // Calculate total remaining hours and get the remainder modulo 24
    const hours = timestampDayjs.diff(nowDayjs, 'hours') % 24;
    // Pad the result with leading zeros if necessary
    return padWithZeros(hours, 2);
}

// Helper function to calculate remaining days (rounded up like BaT)
function getRemainingDays(nowDayjs, timestampDayjs) {
    // Calculate remaining milliseconds and round up to the next whole day.
    const ms = timestampDayjs.diff(nowDayjs, 'millisecond');
    const days = ms <= 0 ? 0 : Math.ceil(ms / 86400000);
    return days.toString();
}

// Function to pad numbers with leading zeros to reach a minimum length
function padWithZeros(number, minLength) {
    // Convert the number to a string
    const numberString = number.toString();
    // If the number already meets or exceeds the minimum length, return it as is
    if(numberString.length >= minLength) return numberString;
    // Otherwise, pad the number with leading zeros
    return "0".repeat(minLength - numberString.length) +  numberString;
}
