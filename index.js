const active = document.getElementById('active-list');
const completed = document.getElementById('completed-list');
const archived = document.getElementById('archieved-list');
let activeTasks = [];
let completedTasks = [];
let archivedTasks = [];

function renderTask(task, container, tasks) {
    const taskId = Date.now();
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
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, task, tasks, container));
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, task, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(task, tasks, container));
    } else if (container === completed) {
        createAndAddIcon('archive-icon', 'archive', () => addTask(task, archivedTasks, archived, task, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(task, tasks, container));
    } else if (container === archived) {
        createAndAddIcon('done-icon', 'done', () => addTask(task, completedTasks, completed, task, tasks, container));
        createAndAddIcon('unarchive-icon', 'unarchive', () => addTask(task, activeTasks, active, task, tasks, container));
        createAndAddIcon('delete-icon', 'delete', () => removeTask(task, tasks, container));
    }
    todo.appendChild(iconContainer);
    container.appendChild(todo);
}

function addTask(task, tasks, container) {
    const inputField = container.querySelector('input');
    const value = task === null ? inputField.value : task;
    if (!value) return;
    const taskId = Date.now();
    tasks.push({ id: taskId, text: value });
    renderTask(value, container, tasks);
    inputField.value = '';
    saveTasksToLocalStorage();
}

function removeTask(task, tasks, container) {
    if (!task) {
        return;
    }
    const index = tasks.findIndex(item => item.text === task);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    const listItems = container.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const taskId = listItem.getAttribute('data-task-id');
        if (taskId && !tasks.some(item => item.id === Number(taskId))) {
            listItem.remove();
        }
    }
    saveTasksToLocalStorage();
}

function createIcon(className, text, clickHandler) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined ' + className);
    icon.textContent = text;
    icon.addEventListener('click', clickHandler);
    return icon;
}

function saveTasksToLocalStorage() {
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks.map(task => task.text)));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks.map(task => task.text)));
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks.map(task => task.text)));
}

document.addEventListener('DOMContentLoaded', function () {
    activeTasks = loadTasksFromLocalStorage('activeTasks');
    completedTasks = loadTasksFromLocalStorage('completedTasks');
    archivedTasks = loadTasksFromLocalStorage('archivedTasks');
    activeTasks.forEach((task) => renderTask(task.text, active, activeTasks));
    completedTasks.forEach((task) => renderTask(task.text, completed, completedTasks));
    archivedTasks.forEach((task) => renderTask(task.text, archived, archivedTasks));
});

function loadTasksFromLocalStorage(key) {
    const storedTasks = localStorage.getItem(key);
    return storedTasks ? JSON.parse(storedTasks).map(taskText => ({ id: Date.now(), text: taskText })) : [];
}