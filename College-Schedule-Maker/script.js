/**
 * This JavaScript program allows the user to generate a weekly schedule for school.
 *
 * The schedule can be saved onto the computer as a .JPEG or printed.
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
        this.table = document.querySelector("#schedule>table");
        this.overlay = document.querySelector(".overlay");
        this.title = document.querySelector("#schedule-header>h1");
        this.headerInput = document.querySelector("#header-input");
        this.boxRequired = document.querySelector("#checkbox-required");
        this.addModal = document.querySelector("#add-modal");
        this.editModal = document.querySelector("#edit-modal");
        this.deleteModal = document.querySelector("#delete-modal");
        this.editCourse = document.querySelector("#edit-course");
        this.deleteCourse = document.querySelector("#delete-course");
        this.schedule = document.querySelector("#schedule");
        this.topbarDiv = document.querySelector("#top-bar")
        this.opitionDiv = document.querySelector("#options");

        /** CSS class/id instances */
        this.active = "modal";     // represents the pop up form for the user to interact with.
        this.active = "active";    // represents when a modal or overlay is active.
        this.used   = "used";      // represents course is placed on current timeslot.
        this.scroll = "scroll-box" // represents the scroll box.

        /** class instances. */
        this.course = [];            // {array}  represents a collection of all the courses in the schedule.
        this.temp = new Course();    // {object} represents a course that has not been finalized.
        this.index = null;           // {number} represents index of a course relative in the array.
        this.indent = 1;             // {number} represents the number of cells was used to indent the table.
        this.size = 7;               // {number} represents how many days in a week will be displayed.
        this.earliest = 0;           // {number} represents earliest time the schedule will display.
        this.latest = 23;            // {number} represents the latest time the schedule will display.

        this.days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.color = ["#AED6F1", "#A3E4D7", "#E6B0AA", "#D7BDE2",
                      "#F5CBA7", "#F8BBD0", "#B3E5FC", "#C5CAE9",
                      "#BCAAA4", "#D6DBDF"];

        this.buildSchedule();
    }


    /**
     * @function set up the schedule table for the user to interact with.
     */
    buildSchedule() {
        this.clearDiv(this.table);
        this.setDaysOfWeek();
        this.buildGrid();
        this.setTimeSlots();
    }

    /**
     * @function removes all child element from given element.
     *
     * @param div {Element} the element's child to be removed.
     */
    clearDiv(div) {
        while (div.hasChildNodes()) div.removeChild(div.firstChild);
    }

    /**
     * @function display the days of the week on the top row.
     */
    setDaysOfWeek() {
        const row = this.table.insertRow();

        for (let i = 0; i <= this.size; i++) {
            row.insertCell();
            this.table.rows[0].cells[i].innerHTML = this.days[i];
        }
    }

    /**
     * @function generate the table grid to allow courses to be displayed.
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
     * @function display the time slots on the first column.
     */
    setTimeSlots() {
        let row = 1;

        for (let i = this.earliest; i <= this.latest; i++) {
            let time = new Time(i)
            if (i >= 12) time = new Time(i, 0, true, true);
            this.table.rows[row].cells[0].innerHTML = time.toTime();
            row++;
        }
    }

    /**
     * @function display the modal form for the user to interact with.
     *
     * @param form {Element}   the form to be displayed.
     * @param usedBy {Element} the div that opened the form.
     */
    displayModal(form, usedBy=null) {
        form.classList.add(this.active);
        this.overlay.classList.add(this.active);

        // update shared form with correct texts.
        if (usedBy !== null) {
            const title = document.querySelector("#add-form-title");
            const button = document.querySelector("#add-form-submit");

            if (usedBy === this.addModal) {
                title.innerHTML = "Add a Course";
                button.value = "Add Course";
            }

            if (usedBy === this.editModal) {
                title.innerHTML = "Edit a Course";
                button.value = "Edit Course";
            }
        }
    }

    /**
     * @function hide the modal form from user.
     *
     * @param form {Element} the form to be removed.
     */
    removeModal(form) {
        form.classList.remove(this.active);
        this.overlay.classList.remove(this.active);
    }

    /**
     * @function hide the modal form without adding the course to the schedule.
     *
     * @param form {Element} the form being closed.
     */
    cancelModal(form) {
        this.index = null;
        this.removeModal(form);
    }

    /**
     * @function display each course on the schedule.
     */
    displayEachCourse() {
        this.buildSchedule(); // remove previous grid.

        for (let i = 0; i < this.course.length; i++) {
            const course = this.course[i];

            let rowStart = course.startTime.hour - this.earliest + this.indent;
            let rowEnd = course.endTime.hour - this.earliest + this.indent;

            for (let row = rowStart; row <= rowEnd; row++) {
                for (let j = 1; j <= this.size; j++) {
                    if (course.checkbox[j]) {
                        this.table.rows[rowStart].cells[j].innerHTML = course.display();
                        this.table.rows[row].cells[j].style.backgroundColor = this.color[i % this.color.length];
                        this.table.rows[row].cells[j].classList.add(this.used);
                    }
                }
            }
        }
    }

    /**
     * @function display the user's title for the schedule.
     */
    displayScheduleTitle() {
        this.title.innerHTML = this.headerInput.value;
    }

    /**
     * @function display the form for adding a course to the schedule.
     */
    displayAddForm() {
        this.index = null;

        this.temp = new Course();
        this.displayModal(this.addModal, this.addModal);
    }

    /**
     * @function display the form for editing a course.
     */
    displayEditForm() {
        this.index = null;

        this.displayModal(this.editModal, this.editModal);
        this.displayEditCourse(this.editCourse);
    }

    /**
     * @function display the form for deleting a course.
     */
    displayDeleteForm() {
        this.index = null;

        this.displayModal(this.deleteModal);
        this.displayEditCourse(this.deleteCourse);
    }

    /**
     * @function display every course for the user to edit.
     *
     * @param div {Element} the div the course will be built in.
     */
    displayEditCourse(div) {
        this.clearDiv(div);

        for (let i = 0; i < this.course.length; i++) {
            const button = document.createElement("button");
            button.innerHTML = this.course[i].courseTitle;
            button.setAttribute("onclick", `updateIndex(${i})`);
            button.style.backgroundColor = this.color[i % this.color.length];
            div.appendChild(button);
        }
    }

    /**
     * @function execute events prior to user confirming changes made to a course.
     */
    submitEditForm() {
        if (this.index === null) return;

        this.copyCourse(this.course[this.index]);
        this.removeModal(this.editModal);
        this.displayModal(this.addModal, this.editModal);
    }

    /**
     * @function generate a new course with given data.
     *
     * @param data {object} the data the course is being initialized with.
     */
    copyCourse(data) {
        this.temp = new Course(data.courseTitle, data.startHour, data.startMinute, data.endHour, data.endMinute,
            data.startAM, data.endAM, data.startPM, data.endPM, data.checkbox1, data.checkbox2,
            data.checkbox3, data.checkbox4, data.checkbox5, data.checkbox6, data.checkbox7);
    }

    /**
     * @function execute events prior to user deleting a course.
     */
    submitDeleteForm() {
        if (this.index === null) return;

        this.removeCourse();
        this.displayEachCourse();
        this.removeModal(this.deleteModal);
    }

    /**
     * @function add the most recently made course to the schedule.
     */
    addCourse() {
        this.removeCourse(); // remove previous course when user edits a schedule.

        this.temp.updateValues();

        if (!this.checkboxValidate()) return;


        this.course.push(this.temp);

        this.displayEachCourse();
        this.removeModal(this.addModal);
    }

    /**
     * @function delete selected course from the schedule
     */
    removeCourse() {
        if (this.index === null) return;

        this.course.splice(this.index, 1);
        this.index = null;
    }

    /**
     * @function keeps track of the selected course.
     *
     * @param index {number} the selected course index in array.
     */
    getIndex(index) {
        this.index = index;
    }

    /**
     * @function validate that at least one day of the week has been selected.
     *
     * @return {boolean} true if at least one day of the week is selected.
     */
    checkboxValidate() {
        for (let i = 0; i <= this.size; i++) {
            this.boxRequired.classList.remove(this.active);
            if (this.temp.checkbox[i]) return true;

        }
        this.boxRequired.classList.add(this.active);

        return false;
    }

    /**
     * @function print the current schedule.
     */
    print() {
        this.trim();
        window.print();
        this.unTrim();
    }

    /**
     * @function trim the schedule of unneeded elements to print or save.
     */
    trim() {
        this.earliest = this.getEarliestCourse();
        this.latest = this.getLatestCourse();

        this.topbarDiv.style.display = "none";
        this.opitionDiv.style.display = "none";
        this.schedule.classList.remove(this.scroll);
        this.displayEachCourse();
    }

    /**
     * @function restore element that were trimmed.
     */
    unTrim() {
        this.earliest = 0;
        this.latest = 23;

        this.topbarDiv.style.display = "grid";
        this.opitionDiv.style.display = "grid";
        this.schedule.classList.add(this.scroll);

        this.displayEachCourse();
    }

    /**
     * @function get the earliest starting course time from schedule.
     *
     * @return {number} the earliest hour in current schedule
     */
    getEarliestCourse() {
        let earliestCourse = this.latest; // start at highest value.

        for (let i = 0; i < this.course.length; i++) {
            if (this.course[i].startTime.hour < earliestCourse) earliestCourse = this.course[i].startTime.hour;
        }

        return earliestCourse;
    }

    /**
     * @function get the latest course time from schedule.
     *
     * @return {number} the latest hour in current schedule.
     */
    getLatestCourse() {
        let latestCourse = this.earliest; // start at lowest value.

        for (let i = 0; i < this.course.length; i++) {
            if (this.course[i].endTime.hour > latestCourse) latestCourse = this.course[i].endTime.hour;
        }

        return latestCourse;
    }
}


/**
 * @class represents a course in the Schedule.
 */
class Course {
    /**
     *
     * @param title        {string} the title of the course.
     * @param startHour    {string} the starting hour for the course.
     * @param startMinute  {string} the starting minute for the course.
     * @param endHour      {string} the ending hour for the course.
     * @param endMinute    {string} the ending minute for the course.
     * @param startAM      {boolean} true if the starting hour's meridiem is "AM".
     * @param endAM        {boolean} true if the ending hour's meridiem is "AM".
     * @param startPM      {boolean} true if the starting hour's meridiem is "PM".
     * @param endPM        {boolean} true if the ending hour's meridiem is "PM.
     * @param checkbox1    {boolean} true if the Monday checkbox is selected.
     * @param checkbox2    {boolean} true if the Monday checkbox is selected.
     * @param checkbox3    {boolean} true if the Monday checkbox is selected.
     * @param checkbox4    {boolean} true if the Monday checkbox is selected.
     * @param checkbox5    {boolean} true if the Monday checkbox is selected.
     * @param checkbox6    {boolean} true if the Monday checkbox is selected.
     * @param checkbox7    {boolean} true if the Monday checkbox is selected.
     */
    constructor(title ="", startHour="", startMinute="", endHour="", endMinute="",
                startAM=true, endAM=true, startPM=false, endPM=false,
                checkbox1=false, checkbox2=false, checkbox3=false,
                checkbox4 = false, checkbox5=false, checkbox6=false, checkbox7=false) {

        /** HTML Tag instances **/
        this.courseTitle = document.querySelector("#course-title").value = title;
        this.startHour = document.querySelector("#start-hour").value = startHour;
        this.startMinute = document.querySelector("#start-minute").value = startMinute;
        this.endHour = document.querySelector("#end-hour").value = endHour;
        this.endMinute = document.querySelector("#end-minute").value = endMinute;
        this.startAM = document.querySelector("#start-am").checked = startAM;
        this.endAM = document.querySelector("#end-am").checked = endAM;
        this.startPM = document.querySelector("#start-pm").checked = startPM;
        this.endPM = document.querySelector("#end-pm").checked = endPM;
        this.checkbox1 = document.querySelector("#mon-checkbox").checked = checkbox1;
        this.checkbox2 = document.querySelector("#tue-checkbox").checked = checkbox2;
        this.checkbox3 = document.querySelector("#wed-checkbox").checked = checkbox3;
        this.checkbox4 = document.querySelector("#thu-checkbox").checked = checkbox4;
        this.checkbox5 = document.querySelector("#fri-checkbox").checked = checkbox5;
        this.checkbox6 = document.querySelector("#sat-checkbox").checked = checkbox6;
        this.checkbox7 = document.querySelector("#sun-checkbox").checked = checkbox7;

        this.checkbox = []; // {array} represents a collection of the days of the week checkbox.
    }

    /**
     * @function update all instances to the current value from the DOM.
     */
    updateValues() {
        this.courseTitle = document.querySelector("#course-title").value;
        this.startHour = document.querySelector("#start-hour").value;
        this.startMinute = document.querySelector("#start-minute").value;
        this.endHour = document.querySelector("#end-hour").value;
        this.endMinute = document.querySelector("#end-minute").value;
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

        this.startTime = new Time(parseInt(this.startHour), parseInt(this.startMinute), this.startPM);
        this.endTime = new Time (parseInt(this.endHour), parseInt(this.endMinute), this.endPM);
    }

    /**
     * @function display course information on the schedule.
     *
     * @return {string} course title + (new line) + start time - (new line) end time.
     */
    display() {
        const time = `${this.startTime.toTime()}-<pre>${this.endTime.toTime()}</pre>`

        return `${this.courseTitle}<pre>${" "}</pre><pre>${time}</pre>`;
    }
}


/**
 * @class converts numbers that represents time to string in hours:minute AM/PM format.
 *
 * @param hour    {number}  represent the amount of hours.
 * @param minute  {number}  represents the amount of minutes.
 * @param pm      {boolean} true if the hour meridiem is PM.
 * @param hour24  {boolean} true if the time is given in 24-hour format.
 *                          false if the time is given in 12-hour format.
 */
class Time {
    constructor(hour, minute=0, pm=false, hour24=false) {
        this.pm = pm;
        this.hour24 = hour24;
        this.minute = minute;
        this.hour = this.to24Hour(hour);
    }

    /**
     * @function convert give hour to a 24 hour time format.
     *
     * @param hour {number} the hour being converted.
     *
     * @return {number} that represents the hour in a 24 hour time format.
     */
    to24Hour(hour) {
        if (!this.hour24) {
            if (this.pm && hour !== 12) hour += 12;
            if (!this.pm && hour === 12) hour = 0;
        }

        return hour;
    }

    /**
     * @function converts given hour to a 12 hour time format.
     *
     * @param hour {number} the hour being converted.
     *
     * @return a string that represents the hour.
     */
    to12Hour(hour) {
        if (hour >= 12 && hour < 24) {
            this.pm = true

            hour -= 12;
        }

        if (hour === 0) return "12";

        return hour.toString();
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
     * @function converts given hour and minute in a 12 hour HH:MM format.
     */
    toTime() {
        const hour = this.to12Hour(this.hour);
        const minute = this.toMinute(this.minute);

        if (this.pm) return `${hour}:${minute}PM`

        return `${hour}:${minute}AM`;
    }
}


/*** JavaScript Functions ***/

/**
 * @function catch the events when the user wants to cancel submitting a form.
 *
 * @param childElement {Element} the child node of the form being closed.
 */
const exit = (childElement) => schedule.cancelModal(childElement.parentElement);

/**
 * @function catch the events when the user wants to add a course to the schedule.
 */
const add = () => schedule.displayAddForm();

/**
 * @function catch the events when the user wants to edit a course on the schedule.
 */
const edit = () => schedule.displayEditForm();

/**
 * @function catch the events when the user selects wants to delete a course from the schedule.
 */
const remove = () => schedule.displayDeleteForm();

/**
 * @function catch the events when the user wants to print the current schedule.
 */
const print = () => schedule.print();

/**
 * @function catch the events when the user submits a course to be added to the schedule.
 */
const addSubmit = () => setTimeout("schedule.addCourse()", 0);

/**
 * @function catch the events when the user confirms the changes made to a course.
 */
const editSubmit = () => schedule.submitEditForm();

/**
 * @function catch the events when the user deleting a course from the schedule.
 */
const deleteSubmit = () => schedule.submitDeleteForm();

/**
 * @function catch the events when the user adds a title for the schedule.
 */
const getScheduleTitle = () => setTimeout("schedule.displayScheduleTitle()", 0);

/**
 * @function get the user's selected course when editing or deleting.
 *
 * @param index {number} the number that index is updated with.
 */
const updateIndex = (index) => schedule.getIndex(index);


// global instance
const schedule = new Schedule();