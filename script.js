document.addEventListener("DOMContentLoaded", function () {

    // Retrieve existing tasks from localStorage or initialize an empty array
    let existingTasksString = localStorage.getItem('tasks');
    let existingTasks = JSON.parse(existingTasksString) || [];
    let tasksitem = document.getElementById('active-tasks-menu-item');
    let taskcompleted = document.getElementById('task-completed');
    let delete_confirm=document.getElementById('delete-task-confirm');
    let clear_all_tasks=document.getElementById('clear-completed-task');

    // Function to render tasks
    function renderTasks() {
        tasksitem.innerHTML = ''; // Clear existing active tasks
        taskcompleted.innerHTML = ''; // Clear completed tasks

        existingTasks.forEach((task, index) => {
            // Create checkbox for task completion
            let checkInput = document.createElement('input');
            checkInput.type = 'checkbox';
            checkInput.classList.add('task-completed');
            checkInput.checked = task.completed;
            checkInput.addEventListener('change', function () {
                task.completed = this.checked;
                console.log("index:",index);
                updateLocalStorage(); // Update localStorage after state change
                renderTasks(); // Re-render tasks after state change
            });

            // Create task child container
            let taskChildDiv = document.createElement('div');
            taskChildDiv.dataset.index = index;
            taskChildDiv.dataset.taskId = task.id;
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

            // Create edit icon
            let editButton = document.createElement('button');
            editButton.id=''
            editButton.classList.add('btn', 'btn-link', 'text-primary', 'p-0');
            editButton.innerHTML = '<img src="images/edit-icon.svg">';

            // let editTaskId = document.getElementById('form-edittask-btn');
            // editTaskId.addEventListener("click",function(){
            //     console.log("halooo")
            //     document.getElementById('edit-task-form').style.display='flex';
            // });

            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.id='delete-btn';
            deleteButton.classList.add('btn', 'btn-link', 'text-danger', 'p-0');
            deleteButton.innerHTML = '<img src="images/delete-icon.svg">';
            deleteButton.setAttribute('data-bs-toggle','modal');
                deleteButton.setAttribute('data-bs-target', '#exampleModal');
                deleteButton.addEventListener("click",function(){
                    let delete_btn1=document.getElementById('delete-task-confirm');
                    
                   delete_btn1.addEventListener("click",function(){
                    existingTasks=existingTasks.filter((t)=> t.id != task.id);
                    updateLocalStorage();
                     renderTasks();
                   })
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

            // Append the task item to the appropriate section
            if (task.completed) {
                taskcompleted.appendChild(taskChildDiv); // Append to completed tasks section
            } else {
                tasksitem.appendChild(taskChildDiv); // Append to active tasks section
            }
            clear_all_tasks.addEventListener('click',function(){
                existingTasks=existingTasks.filter(task => !task.completed);
                updateLocalStorage();
                renderTasks();
    
            });
            // delete_confirm.addEventListener("click",function(){
            //     console.log("my iddd ");
            //     existingTasks=existingTasks.filter(task=>task.id===taskid);
            //     console.log("deletedddd");
            // })
    
        });
        //delete completed tasks
        if (tasksitem.childNodes.length === 0) {
            tasksitem.innerText = "No tasks available";
        }

        if (taskcompleted.childNodes.length === 0) {
            taskcompleted.innerText = "No completed tasks";
        }

    }
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
    //edit task box display


    // Event listener for submitting task form
    let taskFormId = document.getElementById('task-form');
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
        updateLocalStorage(); // Update localStorage after adding new task
        renderTasks(); // Re-render tasks after adding new task
        this.reset();
    });
});
