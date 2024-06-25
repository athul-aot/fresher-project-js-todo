document.addEventListener("DOMContentLoaded", function () {
    console.log("hai");

    // Retrieve existing tasks from localStorage or initialize an empty array
    let existingTasksString = localStorage.getItem('tasks');
    let existingTasks = JSON.parse(existingTasksString) || [];
    let tasksitem = document.getElementById('active-tasks-menu-item');
    let completedTasks = [];

    // Function to render tasks
    function renderTasks() {
        tasksitem.innerHTML = ''; // Clear existing tasks

        existingTasks.forEach((task, index) => {
            // Create checkbox for task completion
            let checkInput = document.createElement('input');
            checkInput.type = 'checkbox';
            checkInput.classList.add('task-completed');
            checkInput.checked = task.completed;
            checkInput.addEventListener('change', function () {
                task.completed = this.checked;

                if (task.completed) {
                    completedTasks.push(task);
                    existingTasks.splice(index, 1); // Remove task from existingTasks
                } else {
                    completedTasks = completedTasks.filter(t => t.id !== task.id);
                    existingTasks.push(task);
                }

                renderTasks(); // Re-render tasks after state change
                updateLocalStorage(); // Update localStorage after state change
            });

            // Create task child container
            let taskChildDiv = document.createElement('div');
            taskChildDiv.classList.add('tasks-menu-child');

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
            titlePara.classList.add('tasks-menu-para');
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
            editButton.addEventListener('click', function () {
                // Edit task logic here
            });

            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-link', 'text-danger', 'p-0');
            deleteButton.innerHTML = '<img src="images/delete-icon.svg">';
            deleteButton.addEventListener('click', function () {
                deleteTask(index); // Call the delete task function
            });

            // Create description paragraph
            let descriptionPara = document.createElement('p');
            descriptionPara.textContent = task.description;

            // Create due date input (display as read-only)
            let dueDateInput = document.createElement('input');
            dueDateInput.type = 'text';
            dueDateInput.value = task.dueDate;
            dueDateInput.classList.add('form-control', 'mt-2');
            dueDateInput.readOnly = true; // Make it read-only

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

            // Append the task item to the tasks menu
            tasksitem.appendChild(taskChildDiv);
        });

        // Display a message if no tasks are available
        if (existingTasks.length === 0) {
            tasksitem.innerText = "No tasks available";
            console.log("no tasks");
        }
    }

    // Initial render of tasks
    renderTasks();

    // Function to update localStorage with current tasks
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(existingTasks));
    }

    // Event listeners for displaying/hiding task form
    let diplaytaskId = document.getElementById('add-new-task');
    diplaytaskId.addEventListener("click", function (event) {
        document.getElementById('add-task-form').style.display = 'flex';
    });

    let hidetaskId = document.getElementById('close-add-task');
    hidetaskId.addEventListener('click', function (event) {
        document.getElementById('add-task-form').style.display = 'none';
    });

    // Event listener for submitting task form
    let taskformId = document.getElementById('task-form');
    taskformId.addEventListener('submit', function (event) {
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
        updateLocalStorage(); // Update localStorage after adding new task
        renderTasks(); // Re-render tasks after adding new task
        // Reset form inputs if needed
        this.reset()
        document.getElementById('addtask-title').value = '';
        document.getElementById('addtask-description').value = '';
        document.getElementById('addtask-date').value = '';
    });
});
