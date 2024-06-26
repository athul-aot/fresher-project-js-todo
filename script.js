document.addEventListener("DOMContentLoaded", function () {
    // Retrieve existing tasks from localStorage or initialize an empty array
    let existingTasksString = localStorage.getItem('tasks');
    let existingTasks = JSON.parse(existingTasksString) || [];
    let tasksitem = document.getElementById('active-tasks-menu-item');
    let taskcompleted = document.getElementById('task-completed');
    // let delete_confirm = document.getElementById('delete-task-confirm');
    let clear_all_tasks = document.getElementById('clear-completed-task');
    let searchInput = document.querySelector('.form-control'); // Search input field
    let searchButton = document.getElementById('search'); // Search button


    let sortSelect = document.getElementById('dropdownMenuLink'); // Sort select dropdown

    // Function to render tasks
    function renderTasks() {
        tasksitem.innerHTML = '';
        taskcompleted.innerHTML = '';

        existingTasks.forEach((task, index) => {
            // Create checkbox for task completion
            let checkInput = document.createElement('input');
            checkInput.type = 'checkbox';
            checkInput.classList.add('task-completed');
            checkInput.checked = task.completed;
            checkInput.addEventListener('change', function () {
                task.completed = this.checked;
                updateLocalStorage(); // Update localStorage after state change
                renderTasks(); // Re-render tasks after state change
            });

            // Create task child container
            let taskChildDiv = document.createElement('div');
            taskChildDiv.dataset.index = index;
            taskChildDiv.dataset.taskId = task.id;
            taskChildDiv.classList.add('tasks-menu-item');

            // Create content container
            let contentDiv = document.createElement('div');
            contentDiv.classList.add('tasks-child-content');

            // Create title container
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('tasks-child-content-title');

            // Create title heading container
            let titleHeadingDiv = document.createElement('div');
            titleHeadingDiv.classList.add('tasks-child-title-heading');

            // Create title paragraph
            let titlePara = document.createElement('p');
            titlePara.textContent = task.title;

            // Create task status icon
            let statusIcon = document.createElement('span');
            statusIcon.classList.add('tasks-child-heading-icon', 'ms-2'); // Bootstrap margin-left

            // Create button container for edit and delete buttons
            let buttonContainerDiv = document.createElement('div');
            buttonContainerDiv.classList.add('tasks-child-content-title-icon');

            // Create edit button
            let editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-link', 'text-primary', 'p-0');
            editButton.innerHTML = '<img src="images/edit-icon.svg">';
            editButton.addEventListener("click", function () {
                document.getElementById('edit-task-form').style.display = "flex";
                document.getElementById('edittask-title').value = task.title;
                document.getElementById('edittask-description').value = task.description;
                document.getElementById('edittask-date').value = task.dueDate;
                let editTaskButton = document.getElementById('edit-task-form');
                editTaskButton.addEventListener("submit", function (event) {
                    event.preventDefault();
                    let editedDesc = document.getElementById('edittask-description').value;
                    let editedTitle = document.getElementById('edittask-title').value;
                    let editedDate = document.getElementById('edittask-date').value;
                    let taskIndex = existingTasks.findIndex(t => t.id === task.id);

                    if (taskIndex !== -1) {
                        // Update the task with new values
                        existingTasks[taskIndex] = {
                            ...existingTasks[taskIndex],
                            title: editedTitle,
                            description: editedDesc,
                            dueDate: editedDate
                        };
                    }

                    updateLocalStorage();
                    renderTasks();
                });
            });

            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.id = 'delete-btn';
            deleteButton.classList.add('btn', 'btn-link', 'text-danger', 'p-0');
            deleteButton.innerHTML = '<img src="images/delete-icon.svg">';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#exampleModal');
            deleteButton.addEventListener("click", function () {
                let delete_btn1 = document.getElementById('delete-task-confirm');

                delete_btn1.addEventListener("click", function () {
                    existingTasks = existingTasks.filter((t) => t.id != task.id);
                    updateLocalStorage();
                    renderTasks();
                })
            });

            // Create description paragraph
            let descriptionPara = document.createElement('p');
            // descriptionPara.classList.add('tasks-menu-para');
            descriptionPara.textContent = task.description;

            // Create due date input (display as read-only)
            let dueDateInput = document.createElement('div');
            dueDateInput.classList.add('dateDisplay');
            let today = new Date().setHours(0, 0, 0, 0);
            let dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);

            // Check if the due date is past the current date
            if (dueDate < today) {
                dueDateInput.innerHTML = '<img src="images/calender-red.svg">' + task.dueDate;
                dueDateInput.classList.add('date-Display');
                // dueDateInput.classList.add('date-overdue');
            } else {
                dueDateInput.innerHTML = '<img src="images/calender.svg">' + task.dueDate;
            }

            // Assemble the task item
            titleHeadingDiv.appendChild(titlePara);
            titleHeadingDiv.appendChild(statusIcon);

            buttonContainerDiv.appendChild(editButton);
            buttonContainerDiv.appendChild(deleteButton);

            titleDiv.appendChild(titleHeadingDiv);
            titleDiv.appendChild(buttonContainerDiv);

            contentDiv.appendChild(titleDiv);
            contentDiv.appendChild(descriptionPara);
            contentDiv.appendChild(dueDateInput);

            taskChildDiv.appendChild(checkInput);
            taskChildDiv.appendChild(contentDiv);

            // Append the task item to the appropriate section
            if (task.completed) {
                statusIcon.classList.add('tasks-child-heading-sucess');
                statusIcon.classList.remove('tasks-child-heading-icon')
                taskcompleted.appendChild(taskChildDiv);
                 // Append to completed tasks section
            } else {
                tasksitem.appendChild(taskChildDiv); // Append to active tasks section
            }
        });

        clear_all_tasks.addEventListener('click', function () {
            existingTasks = existingTasks.filter(task => !task.completed);
            updateLocalStorage();
            renderTasks();
        });

        if (tasksitem.childNodes.length === 0) {
            tasksitem.innerText = "No tasks available";
        }

        if (taskcompleted.childNodes.length === 0) {
            taskcompleted.innerText = "No completed tasks";
        }
    }

    // Function to update localStorage with current tasks
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(existingTasks));
    }

    // Search functionality
    function filterTasks(query) {
        // Convert query to lowercase for case-insensitive search
        let lowerCaseQuery = query.toLowerCase();
        tasksitem.innerHTML = '';
        taskcompleted.innerHTML = '';

        existingTasks.forEach((task) => {
            if (task.title.toLowerCase().includes(lowerCaseQuery) || task.description.toLowerCase().includes(lowerCaseQuery)) {
                // Reuse the rendering logic but for filtered tasks
                let checkInput = document.createElement('input');
                checkInput.type = 'checkbox';
                checkInput.classList.add('task-completed');
                checkInput.checked = task.completed;
                checkInput.addEventListener('change', function () {
                    task.completed = this.checked;
                    updateLocalStorage(); // Update localStorage after state change
                    renderTasks(); // Re-render tasks after state change
                });

                let taskChildDiv = document.createElement('div');
                taskChildDiv.dataset.taskId = task.id;
                taskChildDiv.classList.add('tasks-menu-item');

                let contentDiv = document.createElement('div');
                contentDiv.classList.add('tasks-child-content');

                let titleDiv = document.createElement('div');
                titleDiv.classList.add('tasks-child-content-title');

                let titleHeadingDiv = document.createElement('div');
                titleHeadingDiv.classList.add('tasks-child-title-heading');

                let titlePara = document.createElement('p');
                titlePara.classList.add('tasks-menu-para');
                titlePara.textContent = task.title;

                let statusIcon = document.createElement('span');
                statusIcon.classList.add('tasks-child-heading-icon', 'ms-2');

                let buttonContainerDiv = document.createElement('div');
                buttonContainerDiv.classList.add('tasks-child-content-title-icon');

                let editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-link', 'text-primary', 'p-0');
                editButton.innerHTML = '<img src="images/edit-icon.svg">';
                editButton.addEventListener("click", function () {
                    document.getElementById('edit-task-form').style.display = "flex";
                    document.getElementById('edittask-title').value = task.title;
                    document.getElementById('edittask-description').value = task.description;
                    document.getElementById('edittask-date').value = task.dueDate;
                    let editTaskButton = document.getElementById('edit-task-form');
                    editTaskButton.addEventListener("submit", function (event) {
                        event.preventDefault();
                        let editedDesc = document.getElementById('edittask-description').value;
                        let editedTitle = document.getElementById('edittask-title').value;
                        let editedDate = document.getElementById('edittask-date').value;
                        let taskIndex = existingTasks.findIndex(t => t.id === task.id);

                        if (taskIndex !== -1) {
                            existingTasks[taskIndex] = {
                                ...existingTasks[taskIndex],
                                title: editedTitle,
                                description: editedDesc,
                                dueDate: editedDate
                            };
                        }

                        updateLocalStorage();
                        renderTasks();
                    });
                });

                let deleteButton = document.createElement('button');
                deleteButton.id = 'delete-btn';
                deleteButton.classList.add('btn', 'btn-link', 'text-danger', 'p-0');
                deleteButton.innerHTML = '<img src="images/delete-icon.svg">';
                deleteButton.setAttribute('data-bs-toggle', 'modal');
                deleteButton.setAttribute('data-bs-target', '#exampleModal');
                deleteButton.addEventListener("click", function () {
                    let delete_btn1 = document.getElementById('delete-task-confirm');
                    delete_btn1.addEventListener("click", function () {
                        existingTasks = existingTasks.filter((t) => t.id != task.id);
                        updateLocalStorage();
                        renderTasks();
                    })
                });

                let descriptionPara = document.createElement('p');
                descriptionPara.textContent = task.description;

                let dueDateInput = document.createElement('div');
                dueDateInput.classList.add('dateDisplay');
                let today = new Date().setHours(0, 0, 0, 0);
                let dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);

                if (dueDate < today) {
                    dueDateInput.innerHTML = '<img src="images/calender-red.svg">' + task.dueDate;
                    dueDateInput.classList.add('date-Display');
                } else {
                    dueDateInput.innerHTML = '<img src="images/calender.svg">' + task.dueDate;
                }

                titleHeadingDiv.appendChild(titlePara);
                titleHeadingDiv.appendChild(statusIcon);

                buttonContainerDiv.appendChild(editButton);
                buttonContainerDiv.appendChild(deleteButton);

                titleDiv.appendChild(titleHeadingDiv);
                titleDiv.appendChild(buttonContainerDiv);

                contentDiv.appendChild(titleDiv);
                contentDiv.appendChild(descriptionPara);
                contentDiv.appendChild(dueDateInput);

                taskChildDiv.appendChild(checkInput);
                taskChildDiv.appendChild(contentDiv);

                if (task.completed) {
                    taskcompleted.appendChild(taskChildDiv);
                } else {
                    tasksitem.appendChild(taskChildDiv);
                }
            }
        });

        if (tasksitem.childNodes.length === 0) {
            tasksitem.innerText = "No tasks available";
        }

        if (taskcompleted.childNodes.length === 0) {
            taskcompleted.innerText = "No completed tasks";
        }
    }

    // Event listener for search input
    searchButton.addEventListener('click', function () {
        filterTasks(searchInput.value);
    });

    searchInput.addEventListener('input', function () {
        filterTasks(searchInput.value);
    });

    // Sort functionality
    function sortTasks(criteria) {
        if (criteria === "n") {
            existingTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        } else if (criteria === "o") {
            existingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }
        renderTasks();
    }
    let newest=document.getElementById('newest');
    let oldest=document.getElementById('oldest');
    newest.addEventListener("click",function(){
        sortSelect.innerHTML='Newest First'
        sortTasks("n");
    });
    oldest.addEventListener("click",function(){
        sortSelect.innerHTML='Oldest First'
        sortTasks("o");
    });
    // Event listener for sort select
    // sortSelect.addEventListener('change', function () {

    //     console.log(sortSelect.textContent);
    //     sortTasks(sortSelect.value);
    // });

    renderTasks();

    // Function to update localStorage with current tasks
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(existingTasks));
    }

    // Event listeners for displaying/hiding task form
    let displayTaskId = document.getElementById('add-new-task');
    displayTaskId.addEventListener("click", function () {
        document.getElementById('add-task-form').style.display = 'flex';
    });

    let hideTaskId = document.getElementById('close-add-task');
    hideTaskId.addEventListener('click', function () {
        document.getElementById('add-task-form').style.display = 'none';
    });
    let canceladdTask=document.getElementById('form-cancel-btn');
    canceladdTask.addEventListener("click",function(){
        document.getElementById('add-task-form').style.display = 'none';
    });

    let edithideTaskId = document.getElementById('close-edit-task');
    edithideTaskId.addEventListener('click', function () {
        document.getElementById('edit-task-form').style.display = 'none';
    });

    let canceleditTask=document.getElementById('form-editcancel-btn');
    canceleditTask.addEventListener("click",function(){
        document.getElementById('edit-task-form').style.display = 'none';
    });

    // Event listener for submitting task form
    let taskFormId = document.getElementById('add-task-form');
    taskFormId.addEventListener('submit', function (event) {
        event.preventDefault();
        let title = document.getElementById('addtask-title').value;
        let description = document.getElementById('addtask-description').value;
        let dueDate = document.getElementById('addtask-date').value;
        let newTask = {
            id: Date.now(),
            title: title,
            description: description,
            dueDate: dueDate,
            completed: false
        };
        existingTasks.push(newTask);
        document.getElementById('addtask-title').value='';
        document.getElementById('addtask-description').value='';
        document.getElementById('addtask-date').value='';
        updateLocalStorage(); // Update localStorage after adding new task
        renderTasks(); // Re-render tasks after adding new task
    });
});


