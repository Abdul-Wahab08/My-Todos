const input = document.getElementById("inp")
const button = document.getElementById("btn")
const todos = document.getElementById("todos")
const emptyMessage = document.getElementById("emptyMessage")
const showFinishedCheckbox = document.getElementById("checkbox")

function displayEmptyMessage() {
    emptyMessage.style.display = todos.children.length === 0 ? "block" : "none";
}

window.addEventListener("DOMContentLoaded", loadTodosFromLS);

function saveTodosToLS() {
    const allTodos = [];
    todos.querySelectorAll("li").forEach(li => {
        const span = li.querySelector("span");
        const checkbox = li.querySelector("input[type='checkbox']")
        allTodos.push({
            text: span.innerText,
            done: checkbox.checked
        })
    })
    localStorage.setItem("todos", JSON.stringify(allTodos))
}

function loadTodosFromLS() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

    savedTodos.forEach(todo => {
        createTodoElement(todo.text, todo.done)
    })
    displayEmptyMessage();
}


function createTodo() {
    const todoText = input.value.trim();
    if (todoText.length < 3) {
        alert("Please Enter the Valid Todo!")
        return;
    }

    const isDuplicate = Array.from(todos.querySelectorAll("span")).some(span => span.innerText.toLowerCase() === todoText.toLowerCase());
    if (isDuplicate) {
        alert("This Todo already Exists!");
        return;
    }

    createTodoElement(todoText, false)
    input.value = ""
    saveTodosToLS();
    displayEmptyMessage();
}

function createTodoElement(todoText, done) {
    const li = document.createElement("li")
    li.classList.add("flex", "justify-between", "items-center", "gap-10")

    const leftSection = document.createElement("div")
    leftSection.classList.add("flex", "items-center", "gap-2")

    const checkBox = document.createElement("input")
    checkBox.type = 'checkbox';
    checkBox.checked = done;

    const span = document.createElement("span")
    span.innerText = todoText;
    if (done) {
        span.style.textDecoration = "line-through"
    }

    checkBox.addEventListener('change', () => {
        span.style.textDecoration = checkBox.checked ? "line-through" : "none"
        saveTodosToLS();
        applyFilter();
    })

    const actions = document.createElement("div")
    actions.classList.add("flex", "justify-between", "items-center", "gap-2");

    const editBtn = document.createElement("button")
    editBtn.textContent = "Edit"
    editBtn.classList.add("bg-[#1f810a]", "text-white", "px-3", "py-1", "rounded-full", "hover:bg-green-600", "transition", "cursor-pointer");

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("bg-[#1f810a]", "text-white", "px-3", "py-1", "rounded-full", "hover:bg-green-600", "transition", "cursor-pointer");

    function editTodo(span, li) {
        input.value = span.innerText
        li.remove();
        saveTodosToLS();
        displayEmptyMessage();
    }

    function deleteTodo(li) {
        li.remove();
        saveTodosToLS();
        displayEmptyMessage();
    }

    editBtn.addEventListener('click', () => editTodo(span, li))
    deleteBtn.addEventListener('click', () => deleteTodo(li))

    checkBox.setAttribute("aria-label", "Mark todo as done")
    editBtn.title = "Edit this Todo"
    deleteBtn.title = "Delete this Todo"

    leftSection.appendChild(checkBox)
    leftSection.appendChild(span)
    li.appendChild(leftSection)
    actions.appendChild(editBtn)
    actions.appendChild(deleteBtn)
    li.appendChild(actions)
    todos.appendChild(li)
    input.value = ""

    displayEmptyMessage();
    applyFilter();
}

function applyFilter() {
    const showOnlyFinished = showFinishedCheckbox.checked;
    let visibleCount = 0;
    todos.querySelectorAll("li").forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']")
        const isVisible = !showOnlyFinished || checkbox.checked;
        li.style.display = isVisible ? "flex" : "none";
        if (isVisible) {
            visibleCount++;
        }
    });
     emptyMessage.style.display = visibleCount === 0 ? "block": "none"
}

displayEmptyMessage()

input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        createTodo();
    }
})

showFinishedCheckbox.addEventListener('change', applyFilter)
button.addEventListener('click', createTodo)

