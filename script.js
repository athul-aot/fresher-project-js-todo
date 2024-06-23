function showaddTask() {
    document.getElementById("add-task-form").style.display="flex";
    document.getElementById("parent-container").style.opacity=0.3;
    // console.log("haloo")

}
function hideaddTask() {
    document.getElementById("add-task-form").style.display="none";
    document.getElementById("parent-container").style.opacity=1;
}
function createTask() {
    let existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // console.log(typeof(existingTasks))
    let title=document.getElementById("task-form-title-input").value;
    let description=document.getElementById("task-form-description-input").value;
    let date=document.getElementById("task-form-date-input").value;
    let task={
        title:title,
        description:description,
        date:date
    }
    existingTasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(existingTasks));
    document.getElementById("task-form-title-input").value="";
    document.getElementById("task-form-description-input").value="";
    document.getElementById("task-form-date-input").value="";
}

function loadTasks() {
    let taskString=localStorage.getItem('tasks');
    let Tasks=JSON.parse(taskString)||[];
    let activeTasks=document.getElementById("active-tasks-menu-item-child");
    console.log(Tasks);
    console.log(typeof(Tasks));
    console.log(Tasks.length);
    if (Object.keys(Tasks).length===0) {
        activeTasks.style.display="none";
    }
    else{
        for (let i = 0; i < Tasks.length; i++) {
            let task=Tasks[i];
            console.log(task.title);
            let taskElement=activeTasks.cloneNode(true);
            console.log(taskElement);
            let titleElement=taskElement.querySelector(".active-tasks-menu-item-child-content-title p");
            console.log(titleElement)
            if (titleElement) {
                titleElement.textContent=task.title;
            }
            else{
                console.log("not found");
            }
            activeTasks=document.getElementById("active-tasks-menu-item-child");
            activeTasks.appendChild(taskElement);
        }
    }
}

