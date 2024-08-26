const mainContainer = document.querySelector('.main__container');
const mainEmpty = document.querySelector('.main__empty');
const mainList = document.querySelector('.main__list');
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const clearBtn = document.querySelector('.btn-clear');
let chekEmptyCounter = 0;

form.addEventListener('submit', addTask);
mainList.addEventListener('click', deleteTask);
mainList.addEventListener('click', doneTask);
clearBtn.addEventListener('click', clearAllTasks);

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => addLiHTML(task));
}

chekEmptyList();

function addTask (event) {
    event.preventDefault();

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    addLiHTML(newTask);

    saveToLocalStorage();

    taskInput.value = '';
    taskInput.focus();

    chekEmptyList();
}

function deleteTask (event) {
    if (event.target.classList.contains('delete')) {
        const parentNode = event.target.closest('li');

        const id = Number(parentNode.id);
        tasks = tasks.filter(task => task.id !== id);

        parentNode.remove();
    }

    chekEmptyList();
    saveToLocalStorage();
}

function doneTask (event) {
    if (event.target.classList.contains('ready')) {
        const taskContainer = event.target.closest('.main__task');
        const taskTitle = taskContainer.querySelector('.task__title')

        const id = Number(taskContainer.id);

        tasks.forEach((task) => {
            if (task.id === id) {
                task.done = !task.done;
            }
        })

        taskTitle.classList.toggle('title-done');
        taskContainer.classList.toggle('task-done');
    }
    saveToLocalStorage();
}

function chekEmptyList() {
    if (tasks.length === 0 && chekEmptyCounter === 0) {
        const emptyList = 
        `<div class="main__empty">
            <img src="./img/save-nature.svg" alt="#">
            <p>ToDo list is empty</p>
        </div>`;
        mainContainer.insertAdjacentHTML('afterbegin', emptyList);
        chekEmptyCounter = 1;
    } 
    if (tasks.length > 0) {
        mainContainer.style.justifyContent = 'start';
        const mainEmpty = document.querySelector('.main__empty');
        if (mainEmpty) mainEmpty.remove();
        chekEmptyCounter = 0;
    }
}

function saveToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addLiHTML(task) {
    const taskClass = task.done ? 'task__title title-done' : 'task__title';
    const taskContainerClass = task.done ? 'main__task task task-done' : 'main__task task';

    const taskHTML =
    `<li id="${task.id}" class="${taskContainerClass}">
        <p class="${taskClass}">${task.text}</p>
        <div class="task__btns">
            <div class="task__btn ready"><img src="./img/tick.svg" alt="#"></div>
            <div class="task__btn delete"><img src="./img/cross.svg" alt="#"></div>
        </div>
    </li>`;

    mainList.insertAdjacentHTML('beforeend', taskHTML);
}

function clearAllTasks(event){
    if (event.target.classList.contains('btn-clear')) {
        mainList.innerHTML = '';
        localStorage.removeItem('tasks');
        tasks = [];
        chekEmptyList();
    }
}
