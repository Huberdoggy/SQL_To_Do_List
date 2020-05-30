const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

//Get all tasks
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks" ORDER BY "id" DESC;';
    pool.query(queryText).then(result => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch(error => {
      console.log('error getting tasks', error);
      res.sendStatus(500);
    });
  });
  
// Adds a new task to the list of tasks
// Request body must be a task object with a name and due date.
router.post('/',  (req, res) => {
    let newTask = req.body;
    console.log('Adding task', newTask);
  
    let queryText = `INSERT INTO "tasks" ("name", "duedate")
                     VALUES ($1, $2);`;
    pool.query(queryText, [newTask.name, newTask.duedate])
      .then(result => {
        res.sendStatus(201);
      })
      .catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
      });
  });
  
 //PUT
// Updates a task to show that it has been completed
// Request must include a parameter indicating what task to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  //let task = req.body; // Task with updated content
  let taskId = req.params.id; // id of the task to update
  console.log(`Updating task with id of ${taskId}`);
  // TODO - REPLACE BELOW WITH YOUR CODE
  let queryText = '';
  if (req.body.checklist === 'Complete') {
    queryText = `UPDATE "tasks" SET "status" = 'Complete!' WHERE id=$1`;
  } else if (req.body.checklist !== 'Complete') {
    queryText = `UPDATE "tasks" SET "status" = 'Incomplete' WHERE id=$1`;
  }
  // Send query to the DB
  pool.query(queryText, [taskId])
    // Handle :-) result
    .then((result) => {
      console.log('db is happy, sent back a response');
      res.sendStatus(200);
    })
    // Handle :-( result
    .catch((err) => {
      console.log('uh oh, db is mad. Dont make it mad', err);
      res.sendStatus(500);
    })
});
  
// TODO - DELETE 
// Removes a task...
// Request must include a parameter indicating what task to update - the id
router.delete('/:id', (req, res) => {
    let buttonElement = req.params.id; // id of the thing to delete
    console.log(`Delete route called on task with id of ${buttonElement}`);
    // TODO - REPLACE BELOW WITH YOUR CODE
    let queryText = `DELETE FROM "tasks" WHERE id=$1`;
  
    // Send query to the DB
    pool.query(queryText, [buttonElement])
        // Handle :-) result
        .then((result) => {
            console.log('db is happy, sent back a response');
            res.sendStatus(200);
        })
        // Handle :-( result
        .catch((err) => {
            console.log('uh oh, db is mad. Dont make it mad', err);
            res.sendStatus(500);
        });
  
  });


module.exports = router;