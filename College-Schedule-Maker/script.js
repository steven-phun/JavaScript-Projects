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

// TODO:
// add more colors and remove yellow for course color code (brown).
// change "Add Course" color on the add form to make it stand out more.
// add onclick for all option buttons.

/*** JavaScript Classes ***/

/**
 * @class represents the Schedule grid.
 */
class Schedule {
    constructor() {
        /** HTML tag instances*/
        this.table = document.querySelector("#schedule>table");
        this.modal = document.querySelector(".modal");
        this.overlay = document.querySelector(".overlay");
        this.title = document.querySelector("#schedule-header>h1");
        this.headerInput = document.querySelector("#header-input");

        /** CSS class/id instances */
        this.active = "active" // represent when the modal or overlay is active.

        /** class instances. */
        this.item = null;   // {object  represents the current item that the user is working with.
        this.course = [];   // {array}  represents a collection of all the courses in the schedule.
        this.indent = 1;    // {number} represents the number of cells was used to indent the table.
        this.size = 7;      // {number} represents how many days in a week will be displayed.
        this.earliest = 7;  // {number} represents earliest time the schedule will display.
        this.latest = 24;   // {number} represents the latest time the schedule will display.

        this.days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.color = ["#AED6F1", "#A3E4D7", "#E6B0AA", "#D7BDE2", "#F5CBA7", "#D6DBDF", "#F9E79F", "#FAD7A0"];

        this.setup();
    }

    /**
     * @function display user's input for the schedule title.
     */
    getScheduleTitle() {
        this.title.innerHTML = this.headerInput.value;
    }

    /**
     * @function display the the forum for adding a course to the schedule.
     */
    addButton() {
        this.item = new Course();
        this.displayModal()
    }

    /**
     * @function get the course information.
     */
    getCourse() {
        this.course.push(this.item.update());

        this.addCourse();
        this.removeModal();
    }

    /**
     * @function display the most recent added course on the schedule.
     */
    addCourse() {
        const course = this.item;
        let rowStart = course.startHour - this.earliest + this.indent;
        let rowEnd = course.endHour - this.earliest + this.indent;

        if (course.startPM && course.startHour !== 12) rowStart += 12;
        if (course.endPM && course.endHour !== 12) rowEnd += 12;


        for (let row = rowStart; row <= rowEnd; row++) {
            for (let i = 1; i <= this.size; i++) {
                if (course.checkbox[i]) {
                    this.table.rows[rowStart].cells[i].innerHTML = course.courseTitle;
                    this.table.rows[row].cells[i].style.backgroundColor = this.color[0];
                }
            }
        }

        this.color.splice(0, 1);
    }


    /**
     * @function removes selected course from the schedule.
     *
     * @param index {number} the course index number in array.
     */
    removeCourse(index) {
        const course = this.course[index];
        let rowStart = course.startHour - this.earliest + this.indent;
        let rowEnd = course.endHour - this.earliest + this.indent;

        if (course.startPM && course.startHour !== 12) rowStart += 12;
        if (course.endPM && course.endHour !== 12) rowEnd += 12;

        for (let row = rowStart; row <= rowEnd; row++) {
            for (let i = 1; i <= this.size; i++) {
                if (course.checkbox[i]) this.table.rows[row].cells[i].innerHTML = "";
            }
        }
    }

    /**
     * @function closes current form.
     */
    cancel() {
        this.removeModal();
    }

    /**
     * @function display the modal.
     */
    displayModal() {
        this.modal.classList.add(this.active);
        this.overlay.classList.add(this.active);
    }

    /**
     * @function removes the modal.
     */
    removeModal() {
        this.modal.classList.remove(this.active);
        this.overlay.classList.remove(this.active);
    }

    /**
     * @function generate the time slots for the schedule grid.
     */
    buildGrid() {
        for (let i = this.earliest; i <= this.latest; i++) {
            const row = this.table.insertRow(); // insert <tr>.

            for (let j = 0; j <  this.size + this.indent; j++) {
                row.insertCell(); // insert <td>.
            }
        }
    }

    /**
     * @function removes all rows from the schedule grid.
     */
    clearGrid() {
        while (this.table.hasChildNodes()) this.table.removeChild(this.table.firstChild);
    }

    /**
     * @function display the days of the week.
     */
    setDays() {
        const row = this.table.insertRow();

        for (let i = 0; i <= this.size; i++) {
            row.insertCell();
            this.table.rows[0].cells[i].innerHTML = this.days[i];
        }
    }

    /**
     * @function display time slots for the schedule grid.
     */
    setTimeSlots() {
        this.buildGrid();

        let row = 1;

        for (let i = this.earliest; i <= this.latest; i++) {
            const time = new Time(i)
            this.table.rows[row].cells[0].innerHTML = time.timeToString();
            row++;
        }
    }

    /**
     * @function set up the schedule grid to display to the user.
     */
    setup() {
        this.clearGrid();
        this.setDays()
        this.setTimeSlots()
    }
}


/**
 * @class represents a course in the Schedule.
 */
class Course {
    constructor() {
        /** HTML Tag instances **/
        this.courseTitle = document.querySelector("#course-title").value = "";
        this.startHour = document.querySelector("#start-hour").value = "";
        this.startMinute = document.querySelector("#start-minute").value = "";
        this.endHour = document.querySelector("#end-hour").value = "";
        this.endMinute = document.querySelector("#end-minute").value = "";
        this.startAM = document.querySelector("#start-am").checked = true;
        this.endAM = document.querySelector("#end-am").checked = true;
        this.startPM = document.querySelector("#start-pm").checked = false;
        this.endPM = document.querySelector("#end-pm").checked = false;
        this.checkbox1 = document.querySelector("#mon-checkbox").checked = false;
        this.checkbox2 = document.querySelector("#tue-checkbox").checked = false;
        this.checkbox3 = document.querySelector("#wed-checkbox").checked = false;
        this.checkbox4 = document.querySelector("#thu-checkbox").checked = false;
        this.checkbox5 = document.querySelector("#fri-checkbox").checked = false;
        this.checkbox6 = document.querySelector("#sat-checkbox").checked = false;
        this.checkbox7 = document.querySelector("#sun-checkbox").checked = false;

        this.checkbox = ["", this.checkbox1, this.checkbox2, this.checkbox3, this.checkbox4,
                             this.checkbox5, this.checkbox6, this.checkbox7];
    }

    /**
     * @function update all fields to the current values.
     */
    update() {
        this.courseTitle = document.querySelector("#course-title").value;
        this.startHour = parseInt(document.querySelector("#start-hour").value);
        this.startMinute = parseInt(document.querySelector("#start-minute").value);
        this.endHour = parseInt(document.querySelector("#end-hour").value);
        this.endMinute = parseInt(document.querySelector("#end-minute").value);
        this.startAM = document.querySelector("#start-am").checked;
        this.endAM = document.querySelector("#end-am").checked;
        this.startPM = document.querySelector("#start-pm").checked;
        this.endPM = document.querySelector("#end-pm").checked;
        this.checkbox1 = document.querySelector("#mon-checkbox").checked;
        this.checkbox2 = document.querySelector("#tue-checkbox").checked;
        this.checkbox3 = document.querySelector("#wed-checkbox").checked;
        this.checkbox4 = document.querySelector("#thu-checkbox").checked;
        this.checkbox5 = document.querySelector("#fri-checkbox").checked;
        this.checkbox6 = document.querySelector("#sat-checkbox").checked;
        this.checkbox7 = document.querySelector("#sun-checkbox").checked;

        this.checkbox = ["", this.checkbox1, this.checkbox2, this.checkbox3, this.checkbox4,
            this.checkbox5, this.checkbox6, this.checkbox7];
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

/**
 * @function catches when the user wants to cancel submitting a form.
 */
const exit = () => schedule.cancel();


/**
 * @function catch the "add" button click.
 */
const add = () => schedule.addButton();

/**
 * @function catch the form submission for adding a course.
 */
const addSubmit = () => setTimeout("schedule.getCourse()", 0);

/**
 * @function catch the user's form submission for the schedule title.
 */
const getScheduleTitle = () => setTimeout("schedule.getScheduleTitle()", 0);


// global instance
const schedule = new Schedule();