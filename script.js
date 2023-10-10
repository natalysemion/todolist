
document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    // Додавання нового завдання
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            createTask(taskText);
            taskInput.value = "";
            saveTasksToLocalStorage();
        }
    }
    // Видалення завдання
    function removeTask(taskElement) {
        taskElement.remove();
        saveTasksToLocalStorage();
    }
    // Створення завдання з текстом та кнопкою "Видалити"
    function createTask(taskText) {
        const li = document.createElement("li");
        li.draggable = true;
        const taskContent = document.createElement("span");
        taskContent.textContent = taskText;
        // Додавання кнопки "Видалити"
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", function () {
            removeTask(li);
        });
        li.appendChild(taskContent);
        li.appendChild(deleteButton);
        // Обробники подій для drag-and-drop
        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragover", handleDragOver);
        li.addEventListener("dragenter", handleDragEnter);
        li.addEventListener("dragleave", handleDragLeave);
        li.addEventListener("drop", handleDrop);
        taskList.appendChild(li);
    }
    // Обробники подій для drag-and-drop
    let draggedItem = null;
    function handleDragStart(e) {
        draggedItem = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", e.target.textContent);
    }
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = "move";
        return false;
    }
    function handleDragEnter(e) {
        e.target.classList.add("drag-over");
    }
    function handleDragLeave(e) {
        e.target.classList.remove("drag-over");
    }
    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove("drag-over");
        if (draggedItem !== e.target) {
            const tempText = e.target.querySelector("span").textContent;
            e.target.querySelector("span").textContent = draggedItem.querySelector("span").textContent;
            draggedItem.querySelector("span").textContent = tempText;
        }
        saveTasksToLocalStorage();
    }
    // Завантаження завдань з локального сховища
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        for (const taskText of tasks) {
            createTask(taskText);
        }
    }
    // Збереження завдань у локальному сховищі
    function saveTasksToLocalStorage() {
        const taskElements = taskList.getElementsByTagName("li");
        const tasks = [];
        for (const task of taskElements) {
            tasks.push(task.querySelector("span").textContent);
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    // Обробники подій
    addTaskButton.addEventListener("click", addTask);
    loadTasksFromLocalStorage();
});
