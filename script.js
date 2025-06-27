// Select DOM elements
const taskInput = document.querySelector('#input-box');
const dueDateInput = document.querySelector('#due-date');
const addButton = document.querySelector('button');
const taskList = document.querySelector('#task-list');
const filterSelect = document.querySelector('#filter');

// Array to store tasks
let tasks = [];

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = savedTasks;
    renderTasks();
    adjustLayout(); // Initialize responsive layout
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value || null;
    if (taskText === '') return;

    tasks.push({ text: taskText, dueDate, status: 'Pending' });
    taskInput.value = '';
    dueDateInput.value = '';
    saveTasks();
    renderTasks();
}

// Toggle task completion status
function toggleTask(index) {
    tasks[index].status = tasks[index].status === 'Completed' ? 'Pending' : 'Completed';
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Filter tasks
function filterTasks() {
    renderTasks(filterSelect.value);
}

// Render tasks to DOM
function renderTasks(filter = 'All') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => 
        filter === 'All' || task.status === filter
    );

    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.status === 'Completed') {
            taskDiv.classList.add('task-completed');
        }
        taskDiv.innerHTML = `
            <label>
                <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.status === 'Completed' ? 'checked' : ''}>
                <span class="${task.status === 'Completed' ? 'completed' : ''}">
                    ${task.text}
                </span>
            </label>
            <span class="task-due">${task.dueDate ? `Due: ${task.dueDate}` : ''}</span>
            <button class="task-button" data-index="${index}">Delete</button>
        `;
        taskList.appendChild(taskDiv);
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Make it responsive-ä¨å
function adjustLayout() {
    const container = document.querySelector('.container');
    if (container) { // Ensure container exists
        if (window.innerWidth <= 768) {
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
        } else {
            container.style.flexDirection = 'row';
            container.style.alignItems = 'flex-start';
        }
    }
}

// Event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterSelect.addEventListener('change', filterTasks);
window.addEventListener('resize', adjustLayout);

// Event delegation for checkbox and delete button
taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.dataset.index;
        toggleTask(index);
    }
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-button')) {
        const index = e.target.dataset.index;
        deleteTask(index);
    }
});