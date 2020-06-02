$(document).ready(function () {
    console.log('jQuery sourced.');
    refreshTasks();
    addClickHandlers();
});
let colorAlert = '';



//For create button
function addClickHandlers() {
    $('#createBtn').on('click', handleCreate);
    $('#taskList').on('click', '#successBtn', completeTask);
    //$('#taskList').on('click', '#successBtn');
    $('#taskList').on('click', '#delBtn', deleteTask);
    //$('#taskList').on('click', '#delBtn', runSwal);
}

/*function successColor() {
    colorAlert = $(this).html();
    $(this).addClass('on_success');
    //$(this).addClass('goGreen');
    $(this).parent().parent().css('color', 'limegreen');
    $(this).parent().parent().addClass('crossOff');
}*/

function handleCreate() {
    console.log('Create button clicked.');
    let tasks = {};
    tasks.name = $('#taskInput').val();
    tasks.duedate = $('#dueDateInput').val();
    addTask(tasks);
}

// refreshTasks will get all tasks from the server and render to page
function refreshTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then(function (response) {
        console.log(response);
        renderTasks(response);

    }).catch(function (error) {
        console.log('error in GET', error);
    });
}

// Displays an array of tasks to the DOM
function renderTasks(tasks) {
    $('#taskList').empty();
    //empty table before for loop
    for (let i = 0; i < tasks.length; i += 1) {
        let task = tasks[i];
        // For each task, append a new row to our table
        ///LEARNED SOMETHING COOL --> the date toString() method.
        let d = new Date(`${task.duedate}`);
        let n = d.toString();
        let rowHtml = $(`<tr>
        <td>${task.name}</td>
        <td> ${n}</td>
        <td>${showCompleteStatus(task)}</td>
        <td><button class="successBtn btn-sm"id="successBtn" data-id="${task.id}">Complete</button><td>
        <td><button class="btn btn-secondary btn-danger btn-sm"id="delBtn" data-id="${task.id}">Delete</button></td></tr>`);

        if (task.status) {
            rowHtml.addClass('crossOff');
            rowHtml.css('color', 'limegreen');
        }
        $('#taskList').append(rowHtml);
    }
}

function showCompleteStatus(task) {
    if (task.status) {
      return 'Completed';
    } else {
      return 'Incomplete';
    }
  }

function addTask(taskToAdd) {
    // adds a task to the database
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: taskToAdd,
    }).then(function (response) {
        console.log('Response from server.', response);
        refreshTasks();
        $('#taskInput').val('');
        $('#dueDateInput').val('');
    }).catch(function (error) {
        console.log('Error in POST', error);
        alert('Unable to add task at this time. Please try again later.');
    });
}

function completeTask() {
    let buttonElement = $(this);
    let id = $(buttonElement).data('id');
    console.log('completeTask', id);
    $.ajax({
        method: 'PUT',
        url: `/tasks/${id}`,
        //data: {
          //  checklist: 'Complete'
        //}
    }).then((response) => {
        //successColor();
        refreshTasks();
    }).catch((err) => {
        console.log("error: ", err);
    });
}


//function deleteTask
function deleteTask() {
    let buttonElement = $(this);
    let id = $(buttonElement).data('id');
    console.log('deleteTask', id);
    $.ajax({
        type: 'DELETE',
        url: `/tasks/${id}`
    });
    let $scr = $(`<script>${swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this task!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Poof! Your task has been deleted!", {
                icon: "success",
              });
              refreshTasks();
            } else {
                swal("Your task has been preserved!", {
                    icon: "info",
                });

            }
          })
    }</script>`);

    $('body').append($scr);

}
