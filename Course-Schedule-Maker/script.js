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
        this.course = []; // {array} represents a collection of all the courses in the schedule.

        this.setup();
    }

    /**
     * @function generate the time slots for the schedule grid.
     */
    buildTimeGrid() {

    }

    /**
     * @function set up the schedule grid to display to the user.
     */
    setup() {
        this.buildTimeGrid();
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