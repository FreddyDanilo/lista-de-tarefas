const addTaskTitleElement = document.querySelector("[data-add-task-title]")
const addTaskDescriptionElement = document.querySelector("[data-add-task-description]")
const addTaskButton = document.querySelector("[data-add-task-button]")
const listTasksElement = document.querySelector("[data-list-tasks]")
const modalTask = document.querySelector("[data-modal-task]")
const taskElement = document.querySelector("[data-task-container]")
let idShowTask

const handleHiddenModal = () => {
    taskElement.classList.remove("task-container-animation")
    setTimeout(() => {
        modalTask.classList.remove("modal-task-animation")
    }, 500)
    modalTask.style.display = "none"
}

const handleShowModal = () => {
    modalTask.style.display = "grid"
    modalTask.classList.add("modal-task-animation")

    setTimeout(() => {
        taskElement.classList.add("task-container-animation")
    }, 500)

    const tasks = JSON.parse(localStorage.getItem("tasks"))
    const taskSeleted = tasks.filter(task => {
        if (task.id === idShowTask) {
            return task
        }
    })

    const { id, title, description, date } = taskSeleted[0]

    taskElement.innerHTML = `
    <h1>${title}</h1>
    <p>${description}</p>
    <pre>${date.split("T")[0]}</pre>
    <div>
        <button data-edit-button>Editar</button>
        <button data-close-button>Sair</button>
        <button data-delete-button>Eliminar</button>
    </div>
    `

    const closeButton = document.querySelector("[data-close-button]")
    closeButton.onclick = () => {
        handleHiddenModal()
    }

    const editButton = document.querySelector("[data-edit-button]")
    editButton.onclick = () => {
        taskElement.innerHTML = `
        <input type="text" value="${title}" data-edit-task-title/>
        <textarea data-edit-task-description>${description}</textarea>
        <div>
            <button data-save-button>Salvar</button>
            <button data-back-button>Voltar</button>
        </div>
        `

        const titleElement = document.querySelector("[data-edit-task-title]")
        const descriptionElement = document.querySelector("[data-edit-task-description]")

        const backButton = document.querySelector("[data-back-button]")
        backButton.onclick = () => {
            handleShowModal()
        }

        const saveButton = document.querySelector("[data-save-button]")
        saveButton.onclick = () => {
            handleSaveTask(id, titleElement.value, descriptionElement.value)
            handleShowModal()
        }
    }

    const deleteButton = document.querySelector("[data-delete-button]")
    deleteButton.onclick = () => {
        handleDeleteTask(id)
        handleHiddenModal()
    }
}

const handleDeleteTask = (id) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"))
    const newTasks = tasks.filter(task => {
        if (task.id !== id) {
            return task
        }
    })

    localStorage.setItem("tasks", JSON.stringify(newTasks))
    handleRenderTasks()
}

const handleSaveTask = (id, title, description) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"))
    const newTasks = tasks.filter(task => {
        if (task.id === id) {
            task.title = title
            task.description = description
            return task
        } else {
            return task
        }
    })

    localStorage.setItem("tasks", JSON.stringify(newTasks))
    handleRenderTasks()

}

const handleMapTasks = () => {
    const tasks = document.querySelectorAll("[data-list-tasks] li")
    tasks.forEach(task => {
        task.onclick = () => {
            idShowTask = task.getAttribute("data-id")
            handleShowModal()
        }
    })
}

const handleRenderTasks = () => {
    if (localStorage.getItem("tasks")) {
        listTasksElement.innerHTML = ""
        const tasks = JSON.parse(localStorage.getItem("tasks"))
        const listTasks = tasks.forEach(({ id, title }) => {
            const li = document.createElement("li")
            li.setAttribute("data-id", id)
            const size = title.split("")
            const txt = document.createTextNode(`${title.substr(0, 40)} ${size.length >= 40 ? "..." : ""}`)
            li.appendChild(txt)
            listTasksElement.appendChild(li)
        });
        handleMapTasks()
    }
}

const handleAddNewTask = (title, description) => {
    const idTask = Math.random(10000).toString().split(".")[1]
    const date = new Date()

    if (title === "" || description === "") {
        alert("Preencha todos os campos!")
        return
    }

    const newTask = {
        id: idTask,
        title: title,
        description: description,
        date: date
    }

    if (localStorage.getItem("tasks")) {
        const tasks = JSON.parse(localStorage.getItem("tasks"))
        tasks.unshift(newTask)
        localStorage.setItem("tasks", JSON.stringify(tasks))
    } else {
        const firstTask = [newTask]
        localStorage.setItem("tasks", JSON.stringify(firstTask))
    }

    handleRenderTasks()
}

addTaskButton.onclick = (e) => {
    e.preventDefault()
    handleAddNewTask(addTaskTitleElement.value, addTaskDescriptionElement.value)
    addTaskTitleElement.value = ""
    addTaskDescriptionElement.value = ""
}

window.onload = () => {
    handleRenderTasks()
}