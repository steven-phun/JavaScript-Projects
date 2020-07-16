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
// add more colors and remove last color grey.
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
        this.overlay = document.querySelector(".overlay");
        this.title = document.querySelector("#schedule-header>h1");
        this.headerInput = document.querySelector("#header-input");
        this.boxRequired = document.querySelector("#checkbox-required");
        this.addModal = document.querySelector("#add-modal");
        this.editModal = document.querySelector("#edit-modal");
        this.deleteModal = document.querySelector("#delete-modal");

        /** CSS class/id instances */
        this.active = "modal";   // represents the pop up form for the user to interact with.
        this.active = "active";  // represent when a modal or overlay is active.

        /** class instances. */
        this.item = null;   // {object} represents the current item that the user is working with.
        this.course = [];   // {array}  represents a collection of all the courses in the schedule.
        this.indent = 1;    // {number} represents the number of cells was used to indent the table.
        this.size = 7;      // {number} represents how many days in a week will be displayed.
        this.earliest = 5;  // {number} represents earliest time the schedule will display.
        this.latest = 22;   // {number} represents the latest time the schedule will display.

        this.days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.color = ["#AED6F1", "#A3E4D7", "#E6B0AA", "#D7BDE2",
                      "#F5CBA7", "#F8BBD0", "#B3E5FC", "#C5CAE9",
                      "#BCAAA4", "#D6DBDF"];

        this.setup();
    }

    /**
     * @function display the form for editing current course that are on the schedule.
     */
    displayEditForm() {
        this.displayModal(this.editModal);
    }

    /**
     * @function get the information on the edited course after user submits the form.
     */
    getEditForm() {

    }

    /**
     * @function display the form for deleting a course that is on the schedule.
     */
    displayDeleteForm() {
        this.displayModal(this.deleteModal);
    }

    /**
     * @function get the information on the deleted course after user submits the form.
     */
    getDeleteForm() {

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
     * @function display the form for adding a course to the schedule.
     */
    displayAddForm() {
        this.item = new Course();
        this.displayModal(this.addModal);
    }

    /**
     * @function get the information on the added course after user submits the form.
     */
    getAddForm() {
        this.item.update();

        if (!this.checkboxRequired()) return;

        this.course.push(this.item);

        this.addCourse();
        this.removeModal(this.addModal);
    }

    /**
     * @function checks if user has selected at least one day of the week.
     *
     * @return {boolean} true if at least one day of the week is selected.
     */
    checkboxRequired() {
        for (let i = 0; i < this.size; i++) {
            this.boxRequired.classList.remove(this.active);
            if (this.item.checkbox[i]) return true;

        }
        this.boxRequired.classList.add(this.active);

        return false;
    }

    /**
     * @function display the most recent course on the schedule.
     */
    addCourse() {
        let rowStart = this.item.startHour - this.earliest + this.indent;
        let rowEnd = this.item.endHour - this.earliest + this.indent;

        if (this.item.startPM && this.item.startHour !== 12) rowStart += 12;
        if (this.item.endPM && this.item.endHour !== 12) rowEnd += 12;

        for (let row = rowStart; row <= rowEnd; row++) {
            for (let i = 1; i <= this.size; i++) {
                if (this.item.checkbox[i]) {
                    // display course information.
                    this.table.rows[rowStart].cells[i].innerHTML = this.item.display();
                    // display course span over its time slots.
                    this.table.rows[row].cells[i].style.backgroundColor = this.color[0];
                }
            }
        }

        this.color.splice(0, 1);
    }

    /**
     * @function display user's input for the schedule title.
     */
    getScheduleTitle() {
        this.title.innerHTML = this.headerInput.value;
    }

    /**
     * @function closes current form.
     *
     * @param form {string} the form being closed.
     */
    close(form) {
        this.removeModal(document.querySelector(form));
    }

    /**
     * @function display the modal.
     *
     * @param form {Element} the form to be displayed.
     */
    displayModal(form) {
        form.classList.add(this.active);
        this.overlay.classList.add(this.active);
    }

    /**
     * @function removes the modal.
     *
     * @param form {Element} the form to be removed.
     */
    removeModal(form) {
        form.classList.remove(this.active);
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

        this.checkbox = []; // {array} represents a collection of the days of the week checkbox.
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

    /**
     * @function display course information (name and time slot).
     *
     * @return {string} course title + (new line) + start time - (new line) end time.
     */
    display() {
        const startTime = new Time(this.startHour, this.startMinute, this.startPM);
        const endTime = new Time (this.endHour, this.endMinute, this.endPM);
        const time = `${startTime.timeToString()}-<pre>${endTime.timeToString()}</pre>`

        return `${this.courseTitle}<pre>${" "}</pre><pre>${time}</pre>`;
    }
}

/**
 * @class converts numbers that represents time to string in hours:minute AM/PM format.
 *
 * @param hour   {number}  represent the amount of hours.
 * @param minute {number}  represents the amount of minutes.
 * @param pm     {boolean} true if the hour indicator is PM.
 */
class Time {
    constructor(hour, minute=0, pm=false) {
        this.hour = hour;
        this.minute = minute;
        this.pm = pm;
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
 *
 * @param form {string} the form the user wants to close.
 */
const close = (form) => schedule.close(form);

/**
 * @function catch the events when user selects the "add" button.
 */
const add = () => schedule.displayAddForm();

/**
 * @function catch the events when user selects the "edit" button.
 */
const edit = () => schedule.displayEditForm();

/**
 * @function catch the events when user selects the "delete" button.
 */
const remove = () => schedule.displayDeleteForm();

/**
 * @function catch the form submission for adding a course.
 */
const addSubmit = () => setTimeout("schedule.getAddForm()", 0);

/**
 * @function catch the form submission for editing a course.
 */
const editSubmit = () => schedule.getEditForm();

/**
 * @function catch the form submission for deleting a course.
 */
const deleteSubmit = () => schedule.getDeleteForm();

/**
 * @function catch the user's form submission for the schedule title.
 */
const getScheduleTitle = () => setTimeout("schedule.getScheduleTitle()", 0);


// global instance
const schedule = new Schedule();