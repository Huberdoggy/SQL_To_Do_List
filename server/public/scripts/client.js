$(document).ready(function(){
    console.log('jQuery sourced.');
    refreshTasks();
    addClickHandlers();
  });

//For create button
function addClickHandlers() {
    $('#createBtn').on('click', handleCreate);
    $('#taskList').on('click', '.completeTask', completeTask);
    $('#taskList').on('click', '.deleteTask', deleteTask);
    $('#taskList').on('click', '.completeTask', function () {
        alert = $(this).html();
        //change color when clicked
        $(this).parent().css('background-color', 'green');
        
    });
}

function handleCreate() {
    console.log('Create button clicked.');
    let tasks = {};
    tasks.name = $('#taskInput').val();
    tasks.duedate = $('#dueDateInput').val();
    addTask(task);
  }

// refreshTasks will get all tasks from the server and render to page
function refreshTasks() {
    $.ajax({
      type: 'GET',
      url: '/tasks'
    }).then(function(response) {
      console.log(response);
      renderTasks(response);
    }).catch(function(error){
      console.log('error in GET', error);
    });
}
  
// Displays an array of tasks to the DOM
function renderTasks(tasks) {
    $('#taskList').empty();
  //empty table before for loop
    for(let i = 0; i < tasks.length; i += 1) {
      let currentTask = tasks[i];
      // For each task, append a new row to our table
      let $tr = $('<tr></tr>');
      $tr.data('currentTask', currentTask);
      $tr.append(`<td>${currentTask.name}</td>`);
      $tr.append(`<td>${currentTask.duedate}</td>`);
      $tr.append(`<td><button class="completeTask" data-id="${currentTask.id}">Complete</button></td>`);
      $tr.append(`<td><button class="deleteTask" data-id="${currentTask.id}">Delete</button></td>`);
      $('#taskList').append($tr);
    }
  }


function addTask() {
  // adds a task to the database
function addTask(taskToAdd) {
    $.ajax({
      type: 'POST',
      url: '/tasks',
      data: taskToAdd,
      }).then(function(response) {
        console.log('Response from server.', response);
        refreshTasks();
      }).catch(function(error) {
        console.log('Error in POST', error);
        alert('Unable to add task at this time. Please try again later.');
      });
  }    
  }

  function completeTask() {
    let buttonElement = $(this);
    let taskId = $(buttonElement).data('id');
    console.log('completeTask', taskId);
    $.ajax({
      method: 'PUT',
      url: `/tasks/${taskId}`,
      data: {
        checklist: 'Complete'
      }
    }).then((response) => {
      refreshTasks();
    }).catch((err) => {
      console.log("error: ", err);
    });
  }
  
  //function deleteTask
  function deleteTask() {
    let buttonElement = $(this);
      let taskId = buttonElement.data("id");
    $.ajax({
      type: 'DELETE',
      url: `/tasks/${taskId}`
    })
      .then((response) => {
        console.log("delete success!");
        refreshTasks();
      })
      .catch((err) => {
        console.log("delete failed :-(", err);
      });
  }