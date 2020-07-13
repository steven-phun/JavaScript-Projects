/**
 * This JavaScript program allows the user to generate a weekly schedule for school.
 *
 * The schedule can be printed, saved onto the computer, or exported to allow changes in the future.
 *
 *
 * @author Steven Phun
 * @since July 9, 2020.
 */

/*jshint esversion: 6 */


/*** JavaScript Classes ***/

/**
 * @class represents the Schedule grid.
 */
class Schedule {
    constructor() {
        /** HTML tag instances*/

        // {element} the HTML table tag where the course time slots will be inserted.
        this.table = document.querySelector("#schedule>table");

        /** CSS color class instances */

        /** class instances. */
        this.course = [];   // {array}  represents a collection of all the courses in the schedule.
        this.weekSize = 7;  // {number} represents how many days in a week will be displayed.
        this.earliest = 0;  // {number} represents earliest time the schedule will display.
        this.latest = 23;   // {number} represents the latest time the schedule will display.

        this.setup();
    }

    /**
     * @function generate the time slots for the schedule grid.
     */
    buildTimeGrid() {
        for (let i = this.earliest; i <= this.latest; i++) {
            let row = this.table.insertRow(); // insert <tr>.

            for (let j = 0; j <  this.weekSize + 1; j++) { // add 1 to size because of indent.
                let cell = row.insertCell(); // insert <td>.
            }
        }
    }

    /**
     * @function display time slots for the schedule grid.
     */
    setTimeSlots() {
        let count = 1;

        for (let i = this.earliest; i <= this.latest; i++) {
            const time = new Time(i)
            this.table.rows[count].cells[0].innerHTML = time.timeToString();
            count++;
        }
    }

    /**
     * @function set up the schedule grid to display to the user.
     */
    setup() {
        this.buildTimeGrid();
        this.setTimeSlots()
    }
}


/**
 * @class represents a course in the Schedule.
 */
class Course {
    constructor() {
        this.start = null; // {number} represents when the course starts.
        this.end = null;   // {number} represents when the course ends.
    }
}


/**
 * @class represents time in hours:minute format.
 *
 * @param hour   {number} represent the amount of hours.
 * @param minute {number} represents the amount of minutes.
 */
class Time {
    constructor(hour, minute=0) {
        this.hour = hour;      // {number} represent the amount of hours.
        this.minute = minute;  // {number} represents the amount of minutes.
        this.pm = false;       // {boolean} true if hours >= 12.
    }

    /**
     * @function convert a single digit minute to standard time format.
     *           --> 1 minute = HH:01.
     *           --> 5 minutes = HH:05.
     * @param minute {number} the minute to convert.
     *
     * @return a string that represents the minute.
     */
    toMinute(minute) {
        if (minute > 9) return minute.toString();

        return `0${minute}`;
    }

    /**
     * @function converts the hour to a 12 hour time format.
     *
     * @param hour {number} the hour being converted.
     *
     * @return a string that represents the hour.
     */
    toHour(hour) {
        if (hour >= 12) {
            if (hour !== 24) this.pm = true;
            if (hour !== 12) hour -= 12;
        }

        if (hour === 0) hour = 12; // when hour = 0 or 24 --> 12AM

        return hour.toString();
    }

    /**
     * @function converts given hour and minute in a 12 hour HH:MM format.
     */
    timeToString() {
        const hour = this.toHour(this.hour);
        const minute = this.toMinute(this.minute);

        if (this.pm) return `${hour}:${minute}PM`

        return `${hour}:${minute}AM`;
    }
}


/*** JavaScript Functions ***/
const schedule = new Schedule();