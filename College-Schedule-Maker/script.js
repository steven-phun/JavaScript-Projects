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
        this.editCourse = document.querySelector("#edit-course");
        this.deleteCourse = document.querySelector("#delete-course");

        /** CSS class/id instances */
        this.active = "modal";   // represents the pop up form for the user to interact with.
        this.active = "active";  // represent when a modal or overlay is active.

        /** class instances. */
        this.course = [];   // {array}  represents a collection of all the courses in the schedule.
        this.temp = null;   // {object} represents a course that has not been finalized.
        this.index = null;  // {number} represents index of a course relative in the array.
        this.indent = 1;    // {number} represents the number of cells was used to indent the table.
        this.size = 7;      // {number} represents how many days in a week will be displayed.
        this.earliest = 5;  // {number} represents earliest time the schedule will display.
        this.latest = 22;   // {number} represents the latest time the schedule will display.

        this.days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.color = ["#AED6F1", "#A3E4D7", "#E6B0AA", "#D7BDE2",
                      "#F5CBA7", "#F8BBD0", "#B3E5FC", "#C5CAE9",
                      "#BCAAA4", "#D6DBDF"];

        this.getEmptyGrid();
    }

    /**
     * @function display the form for editing current course that are on the schedule.
     */
    displayEditForm() {
        this.displayModal(this.editModal, this.editModal);
        this.displayAllCourse(this.editCourse);
    }

    /**
     * @function edit a course on the schedule.
     */
    submitEditForm() {
        if (this.index === null) return;

        this.course[this.index].updateValues(this.course[this.index]); // update the form with selected course data
        this.index = null; // reset index to default value.

        this.removeModal(this.editModal);
        this.displayModal(this.addModal, this.editModal);
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
        this.displayModal(this.deleteModal);
        this.displayAllCourse(this.deleteCourse);
    }

    /**
     * @function delete a course from the schedule.
     */
    submitDeleteForm() {
        if (this.index === null) return;

        this.course.splice(this.index, 1);
        this.index = null; // reset index.
        this.updateDisplay();
        this.removeModal(this.deleteModal);
    }

    /**
     * @function display the form for adding a course to the schedule.
     */
    displayAddForm() {
        this.temp = new Course();
        this.displayModal(this.addModal, this.addModal);
    }

    /**
     * @function get the information on the added course after user submits the form.
     */
    submitAddForm() {
        this.temp.getValues();

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

        let counter = 0; // keeps track of color to use for the course.

        for (let i = 0; i < this.course.length; i++) {
            const course = this.course[i];

            let rowStart = course.startHour - this.earliest + this.indent;
            let rowEnd = course.endHour - this.earliest + this.indent;

            if (course.startPM && course.startHour !== 12) rowStart += 12;
            if (course.endPM && course.endHour !== 12) rowEnd += 12;

            for (let row = rowStart; row <= rowEnd; row++) {
                for (let j = 1; j <= this.size; j++) {
                    if (course.checkbox[j]) {
                        // display course information.
                        this.table.rows[rowStart].cells[j].innerHTML = course.display();
                        // display course span over its time slots.
                        this.table.rows[row].cells[j].style.backgroundColor = this.color[counter];
                    }
                }
            }
            counter++;
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
            const time = new Time(i)
            this.table.rows[row].cells[0].innerHTML = time.timeToString();
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
    getValues() {
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

    }

    /**
     * @function update the form values with the give Object's Value.
     *
     * @param object {Object} the object the DOM being update.
     */
    updateValues(object) {
        return new Course(object.courseTitle, object.startHour, object.startMinute, object.endHour, object.endMinute,
            object.startAM, object.endAM, object.startPM, object.endPM, object.checkbox1, object.checkbox2,
            object.checkbox3, object.checkbox4, object.checkbox5, object.checkbox6, object.checkbox7);
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
 * @function catch the form submission for adding a course.
 */
const addSubmit = () => setTimeout("schedule.submitAddForm()", 0);

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