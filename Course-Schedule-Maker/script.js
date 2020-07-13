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
        this.course = [];                  // {array}  represents a collection of all the courses in the schedule.
        this.weekSize = 7;                 // {number} represents how many days in a week will be displayed.
        this.earliest = new Time(9); // {number} represents earliest time the schedule will display.
        this.latest = new Time(14);  // {number} represents the latest time the schedule will display.

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

        for (let time = this.earliest; time <= this.latest; time++) {
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
    constructor(hour, minute=5) {
        this.hour = hour;                    // {number} represent the amount of hours.
        this.minute = this.toMinute(minute); // {string} represents the amount of minutes.
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
        if (minute >= 10) return minute.toString();

        return `0${minute}`;
    }

    /**
     * @function converts given hour and minute in a 12 hour HH:MM format.
     */
    timeToString() {
        if (this.hour > 12) return `${this.hour - 12}:${this.minute} pm`

        return `${this.hour}:${this.minute} am`;
    }
}


/*** JavaScript Functions ***/
const schedule = new Schedule();