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
        this.topbarDiv = document.querySelector("#top-bar")
        this.opitionDiv = document.querySelector("#options");


        /** CSS class/id instances */
        this.active = "modal";   // represents the pop up form for the user to interact with.
        this.active = "active";  // represents when a modal or overlay is active.
        this.used   = "used";    // represents course is placed on current timeslot.

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

        this.getEmptyGrid();
    }

    /**
     * @function save current schedule to user's desktop.
     */
    save() {
        // keep original values to restore later.
        const tempEarliest = this.earliest;
        const tempLatest = this.latest;

        // trim unnecessary elements for printing.
        this.earliest = this.getEarliestCourse();
        this.latest = this.getLatestCourse();
        this.topbarDiv.style.display = "none";
        this.opitionDiv.style.display = "none";
        this.updateDisplay();

        window.print();

        // restore values to its original state before trim.
        this.earliest = tempEarliest;
        this.latest = tempLatest;
        this.topbarDiv.style.display = "grid";
        this.opitionDiv.style.display = "grid";
        this.updateDisplay();
    }

    /**
     * @function get the earliest timeslot from schedule.
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
     * @function get the latest timeslot from schedule.
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

    /**
     * @function display the form for editing current course that are on the schedule.
     */
    displayEditForm() {
        this.index = null;

        this.displayModal(this.editModal, this.editModal);
        this.displayAllCourse(this.editCourse);
    }

    /**
     * @function edit a course on the schedule.
     */
    submitEditForm() {
        if (this.index === null) return;

        this.copyCourse(this.course[this.index]);
        this.removeModal(this.editModal);
        this.displayModal(this.addModal, this.editModal);
    }

    /**
     * @function generate a new course with data from a given course.
     *
     * @param course {object} the course data that is being copied.
     */
    copyCourse(course) {
        this.temp = new Course(course.courseTitle, course.startHour, course.startMinute, course.endHour, course.endMinute,
            course.startAM, course.endAM, course.startPM, course.endPM, course.checkbox1, course.checkbox2,
            course.checkbox3, course.checkbox4, course.checkbox5, course.checkbox6, course.checkbox7);
    }


    /**
     * @function display every course that was added to the schedule for the user to edit.
     *
     * @param div {Element} the div the course will be built in.
     */
    displayAllCourse(div) {
        this.clearDiv(div);

        for (let i = 0; i < this.course.length; i++) {
            const button = document.createElement("button");
            button.innerHTML = this.course[i].courseTitle;
            button.setAttribute("onclick", `updateIndex(${i})`);
            div.appendChild(button);
        }
    }

    /**
     * @function get the index location of selected course in array.
     *
     * @param index {number} the index location number in array.
     */
    updateIndex(index) {
        this.index = index;
    }

    /**
     * @function display the form for deleting a course that is on the schedule.
     */
    displayDeleteForm() {
        this.index = null;

        this.displayModal(this.deleteModal);
        this.displayAllCourse(this.deleteCourse);
    }

    /**
     * @function delete current selected course from the schedule.
     */
    submitDeleteForm() {
        if (this.index === null) return;

        this.removeCourse();
        this.updateDisplay();
        this.removeModal(this.deleteModal);
    }

    /**
     * @function delete current selected course from the schedule
     */
    removeCourse() {
        if (this.index === null) return;

        this.course.splice(this.index, 1);
        this.index = null;
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
     * @function adds a course to the schedule.
     */
    addCourse() {
        this.removeCourse(); // remove previous course when user edits a schedule.

        this.temp.updateValues();

        if (!this.checkboxRequired()) return;


        this.course.push(this.temp);

        this.updateDisplay();
        this.removeModal(this.addModal);
    }



    /**
     * @function checks if user has selected at least one day of the week.
     *
     * @return {boolean} true if at least one day of the week is selected.
     */
    checkboxRequired() {
        for (let i = 0; i <= this.size; i++) {
            this.boxRequired.classList.remove(this.active);
            if (this.temp.checkbox[i]) return true;

        }
        this.boxRequired.classList.add(this.active);

        return false;
    }

    /**
     * @function display each course on the schedule.
     */
    updateDisplay() {
        this.getEmptyGrid(); // remove previous grid.

        for (let i = 0; i < this.course.length; i++) {
            const course = this.course[i];

            let rowStart = course.startTime.hour - this.earliest + this.indent;
            let rowEnd = course.endTime.hour - this.earliest + this.indent;

            for (let row = rowStart; row <= rowEnd; row++) {
                for (let j = 1; j <= this.size; j++) {
                    if (course.checkbox[j]) {
                        this.table.rows[rowStart].cells[j].innerHTML = course.display();
                        this.table.rows[row].cells[j].style.backgroundColor = this.color[i];
                        this.table.rows[row].cells[j].classList.add(this.used);
                    }
                }
            }
        }
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
     * @param form {Element} the form being closed.
     */
    close(form) {
        this.index = null;
        this.removeModal(form);
    }

    /**
     * @function display the modal form.
     *
     * @param form {Element}   the form to be displayed.
     * @param usedBy {Element} which div is using this form.
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
     * @function removes all child element of given element.
     *
     * @param element {Element} the element's child to be removed.
     */
    clearDiv(element) {
        while (element.hasChildNodes()) element.removeChild(element.firstChild);
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
            let time = new Time(i)
            if (i >= 12) time = new Time(i, 0, true, true);
            this.table.rows[row].cells[0].innerHTML = time.toTime();
            row++;
        }
    }

    /**
     * @function set up the schedule grid to display to the user.
     */
    getEmptyGrid() {
        this.clearDiv(this.table);
        this.setDays()
        this.setTimeSlots()
    }
}


/**
 * @class represents a course in the Schedule.
 *
 * @param startHour {number}
 */
class Course {
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
     * @function display course information (name and time slot).
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
 * @param hour   {number}  represent the amount of hours.
 * @param minute {number}  represents the amount of minutes.
 * @param pm     {boolean} true if the hour indicator is PM.
 * @param hour24 {boolean} true if the time is given in 24 hour format.
 */
class Time {
    constructor(hour, minute=0, pm=false, hour24=false) {
        this.pm = pm;
        this.hour24 = hour24;
        this.minute = minute;
        this.hour = this.to24Hour(hour);
    }

    /**
     * @function convert give hour to a 24 hour format.
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
 * @function catches when the user wants to cancel submitting a form.
 *
 * @param childElement {Element} the child node of the form being closed.
 */
const exit = (childElement) => schedule.close(childElement.parentElement);

/**
 * @function catch the events when user selects the "new" button.
 */
const newSchedule = () => location.reload();

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
 * @function saves the schedule to desktop when user selects the "save" button.
 */
const save = () => schedule.save();

/**
 * @function catch the form submission for adding a course.
 */
const addSubmit = () => setTimeout("schedule.addCourse()", 0);

/**
 * @function catch the form submission for editing a course.
 */
const editSubmit = () => schedule.submitEditForm();

/**
 * @function catch the form submission for deleting a course.
 */
const deleteSubmit = () => schedule.submitDeleteForm();

/**
 * @function catch the user's form submission for the schedule title.
 */
const getScheduleTitle = () => setTimeout("schedule.getScheduleTitle()", 0);

/**
 * @function update the location of selected course in array.
 *
 * @param index {number} the number that index is updated with.
 */
const updateIndex = (index) => schedule.updateIndex(index);


// global instance
const schedule = new Schedule();