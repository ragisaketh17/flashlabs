let courseItemsContainer = document.getElementById("courseItemsContainer");
let addCourseButton = document.getElementById("addCourseButton");
let saveCourseButton = document.getElementById("saveCourseButton");

function getCourseListFromLocalStorage() {
    let stringifiedCourseList = localStorage.getItem("courseList");
    let parsedCourseList = JSON.parse(stringifiedCourseList);
    if (parsedCourseList === null) {
        return [];
    } else {
        return parsedCourseList;
    }
}

let courseList = getCourseListFromLocalStorage();
let coursesCount = courseList.length;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Saves courseList to local storage
 * When the saveCourseButton is clicked, it saves the current courseList to local storage
 */
/*******  51c2de1c-8fbe-43f1-b3cc-3334a7d39dab  *******/
saveCourseButton.onclick = function() {
    localStorage.setItem("courseList", JSON.stringify(courseList));
};

function onAddCourse() {
    let userInputElement = document.getElementById("courseUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Course Name");
        return;
    }

    coursesCount += 1;

    let newCourse = {
        text: userInputValue,
        uniqueNo: coursesCount,
        isChecked: false
    };
    courseList.push(newCourse);
    createAndAppendCourse(newCourse);
    userInputElement.value = "";
}

addCourseButton.onclick = function() {
    onAddCourse();
};

function onCourseStatusChange(checkboxId, labelId, courseId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let index = courseList.findIndex(function(eachItem) {
        let courseIndex = "course" + eachItem.uniqueNo;
        return courseIndex === courseId;
    });

    let mainIndex = courseList[index];
    mainIndex.isChecked = !mainIndex.isChecked;
}

function onDeleteCourse(courseId) {
    let courseElement = document.getElementById(courseId);
    courseItemsContainer.removeChild(courseElement);

    let deleteElementIndex = courseList.findIndex(function(eachCourse) {
        let eachCourseId = "course" + eachCourse.uniqueNo;
        return eachCourseId === courseId;
    });

    courseList.splice(deleteElementIndex, 1);
}

function createAndAppendCourse(course) {
    let courseId = "course" + course.uniqueNo;
    let checkboxId = "checkbox" + course.uniqueNo;
    let labelId = "label" + course.uniqueNo;

    let courseElement = document.createElement("li");
    courseElement.classList.add("course-item-container", "d-flex", "flex-row");
    courseElement.id = courseId;
    courseItemsContainer.appendChild(courseElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = course.isChecked;

    inputElement.onclick = function() {
        onCourseStatusChange(checkboxId, labelId, courseId);
    };

    inputElement.classList.add("checkbox-input");
    courseElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    courseElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = course.text;
    if (course.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);
    inputElement.onclick = function() {
    onCourseStatusChange(checkboxId, labelId, courseId);

    window.location.href = `course.html?courseId=${course.uniqueNo}`;
    };
    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Delete course element from DOM and remove it from courseList
/*******  8136fd98-93af-4693-8ea3-6d5c1f524bc0  *******/
    deleteIcon.onclick = function() {
        onDeleteCourse(courseId);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

// Render saved courses on page load
for (let course of courseList) {
    createAndAppendCourse(course);
}
