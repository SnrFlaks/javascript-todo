const active = document.getElementById('active-list');
const completed = document.getElementById('completed-list');
const archived = document.getElementById('archived-list');
const inputContainer = document.getElementById('input-container');
let activeTasks = [];
let completedTasks = [];
let archivedTasks = [];

function getUniqueId() {
    const random = Math.floor(Math.random() * 10000);
    return `${random}`;
}

function renderTask(task, container, tasks, taskId) {
    const todo = document.createElement('li');
    todo.setAttribute('class', 'item');
    todo.setAttribute('data-task-id', taskId);
    todo.innerHTML += task;
    const iconContainer = document.createElement('div');
    iconContainer.setAttribute('class', 'icon-container');
    const createAndAddIcon = (className, text, clickHandler) => {
        const icon = createIcon(className, text, clickHandler);
        iconContainer.appendChild(icon);
    };
    if (container === active) {
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, taskId, tasks, container));
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, taskId, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container));
    } else if (container === completed) {
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, taskId, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container));
    } else if (container === archived) {
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, taskId, tasks, container));
        createAndAddIcon('unarchive-icon', 'unarchive', () => addTask(task, activeTasks, active, taskId, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container));
    }
    todo.appendChild(iconContainer);
    container.appendChild(todo);
}

function addTask(task, tasks, container, prevTaskId, prevTasks, prevContainer, input) {
    let inputField = container.querySelector('input');
    if (input) {
        inputField = input.querySelector('input');
    }
    const value = task === null ? inputField.value : task;
    if (!value) return;
    const taskId = getUniqueId();
    tasks.push({ id: taskId, text: value });
    renderTask(value, container, tasks, taskId);
    if (prevTasks && prevContainer) {
        removeTask(prevTaskId, prevTasks, prevContainer);
    }
    inputField.value = '';
    saveTasksToLocalStorage();
}

function removeTask(taskId, tasks, container) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        const taskElement = container.querySelector(`li[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }
        saveTasksToLocalStorage();
    }
}

function createIcon(className, text, clickHandler) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined ' + className);
    icon.textContent = text;
    icon.addEventListener('click', clickHandler);
    return icon;
}

function showOrHideList(listElement, tasks) {
    listElement.style.display = tasks.length > 0 ? "block" : "none";
}

function toggleInputContainer() {
    const inputContainer = document.getElementById("input-container");
    const allListsHidden = (active.style.display === "none" && completed.style.display === "none" && archived.style.display === "none");
    inputContainer.style.display = allListsHidden ? "block" : "none";
}

function saveTasksToLocalStorage() {
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
    showOrHideList(active, activeTasks);
    showOrHideList(completed, completedTasks);
    showOrHideList(archived, archivedTasks);
    toggleInputContainer();
}

function loadTasksFromLocalStorage(key) {
    const storedTasks = localStorage.getItem(key);
    return storedTasks ? JSON.parse(storedTasks) : [];
}

document.addEventListener('DOMContentLoaded', function () {
    activeTasks = loadTasksFromLocalStorage('activeTasks');
    completedTasks = loadTasksFromLocalStorage('completedTasks');
    archivedTasks = loadTasksFromLocalStorage('archivedTasks');
    activeTasks.forEach((task) => renderTask(task.text, active, activeTasks, task.id));
    completedTasks.forEach((task) => renderTask(task.text, completed, completedTasks, task.id));
    archivedTasks.forEach((task) => renderTask(task.text, archived, archivedTasks, task.id));
    showOrHideList(active, activeTasks);
    showOrHideList(completed, completedTasks);
    showOrHideList(archived, archivedTasks);
    toggleInputContainer();
});