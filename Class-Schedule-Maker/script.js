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
        this.course = []; // {array} represents a collection of all the courses in the schedule.
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