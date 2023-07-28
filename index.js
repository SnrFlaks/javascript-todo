const active = document.getElementById('active-list');
const completed = document.getElementById('completed-list');
const archived = document.getElementById('archived-list');
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
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, tasks, container), taskId);
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, tasks, container), taskId);
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container), taskId);
    } else if (container === completed) {
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, tasks, container), taskId);
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container), taskId);
    } else if (container === archived) {
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, tasks, container), taskId);
        createAndAddIcon('unarchive-icon', 'unarchive', () => addTask(task, activeTasks, active, tasks, container), taskId);
        createAndAddIcon('delete-icon', 'delete', () => removeTask(taskId, tasks, container), taskId);
    }
    todo.appendChild(iconContainer);
    container.appendChild(todo);
}

function addTask(task, tasks, container, prevTasks, prevContainer) {
    const inputField = container.querySelector('input');
    const value = task === null ? inputField.value : task;
    if (!value) return;
    const taskId = getUniqueId();
    tasks.push({ id: taskId, text: value });
    renderTask(value, container, tasks, taskId);
    if (prevTasks && prevContainer) {
        removeTask(task, prevTasks, prevContainer);
    }
    inputField.value = '';
    saveTasksToLocalStorage();
}

function removeTask(taskId, tasks, container) {
    const taskIndex = tasks.findIndex(task => task.id === String(taskId));
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        const taskElement = container.querySelector(`li[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        } else {
            console.warn(`Task element with id ${taskId} not found in the container.`);
        }
        saveTasksToLocalStorage();
    } else {
        console.warn(`Task with id ${taskId} not found in the tasks array.`);
        return;
    }
}

function createIcon(className, text, clickHandler) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined ' + className);
    icon.textContent = text;
    icon.addEventListener('click', clickHandler);
    return icon;
}

function saveTasksToLocalStorage() {
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
}

document.addEventListener('DOMContentLoaded', function () {
    activeTasks = loadTasksFromLocalStorage('activeTasks');
    completedTasks = loadTasksFromLocalStorage('completedTasks');
    archivedTasks = loadTasksFromLocalStorage('archivedTasks');
    activeTasks.forEach((task) => renderTask(task.text, active, activeTasks, task.id));
    completedTasks.forEach((task) => renderTask(task.text, completed, completedTasks, task.id));
    archivedTasks.forEach((task) => renderTask(task.text, archived, archivedTasks, task.id));
});

function loadTasksFromLocalStorage(key) {
    const storedTasks = localStorage.getItem(key);
    return storedTasks ? JSON.parse(storedTasks) : [];
}