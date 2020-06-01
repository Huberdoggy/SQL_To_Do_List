Heroku
Heroku is a Cloud Application Platform that will allow you to publish your apps to the web. We'll be primarily using Heroku in this class but it's important to note that there are many other companies out there that offer similar services.

Best of all, Heroku is free for development use!

Summary Steps
Heroku Prerequisite
Sign up for an account on Heroku.com
Install Heroku CLI by typing brew tap heroku/brew && brew install heroku in Terminal
Additional installation notes and troubleshooting
Authenticate by typing heroku login in Terminal
Note: Your project also needs to have a git repository.

Heroku Setup
Before you deploy, make sure your server port is configured correctly as:

var port = process.env.PORT || 5000;
Run the following commands from within your project folder.

In terminal, navigate to your project folder and type heroku create
Login in if prompted
Type git remote -v to ensure it added successfully
In terminal, type git push heroku master
Our website is now live! However... we also have a database
Postgresql on Heroku
In terminal, type heroku addons:create heroku-postgresql:hobby-dev to set up Postgresql on your Heroku project
Next, type heroku pg:push your_database DATABASE_URL to copy your database contents up to Heroku. your_database is the actual name of your database (e.g. koala_holla_). DATABASE_URL is a heroku config variable created by the Add On. Do not replace it with something else, just type: DATABASE_URL. For example, if you were deploying the koala_holla database, you should type heroku pg:push koala_holla DATABASE_URL
Update or create a module for your pg-pool configuration to the following code that will convert the heroku DATABASE_URL into a pool config object. The only line you should have to change is database: process.env.DATABASE_NAME || 'your_database'. Change your_database to the actual name of your database. (e.g. database: process.env.DATABASE_NAME || 'koala_holla':
modules/pool.js

/**
* You'll need to use environment variables in order to deploy your
* pg-pool configuration to Heroku.
* It will look something like this:
**/
/* the only line you likely need to change is
 database: 'prime_app',
 change `prime_app` to the name of your database, and you should be all set!
*/

const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
} else {
  config = {
    host: 'localhost', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    database: 'prime_app', // CHANGE THIS LINE! env var: PGDATABASE, this is likely the one thing you need to change to get up and running
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
}

// this creates the pool that will be shared by all other modules
const pool = new pg.Pool(config);

// the pool will log when it connects to the database
pool.on('connect', () => {
  console.log('Postgesql connected');
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
When you need a pool, use the following code:

var pool = require('../modules/pool.js');
###########################################

Next, commit your changes and push them to Heroku:

git add .
git commit -m "MESSAGE"
git push heroku master

Note: You'll need to commit and push each time you make a change that you want to deploy to Heroku. Automatic deployments are covered in a later section Keep in mind you CAN NOT pull from Heroku. This is not a replacement for GitHub!

Lastly, open terminal and type heroku open, which should show you your deployed site!

#####################################################
Note: It is best to fully test your code locally before deploying to Heroku. Bugs are much harder to troubleshoot on a live website.

Miscellaneous
heroku logs - Display error logs
heroku config - Show basic app info
heroku restart - Sometimes it helps to turn things off an on again
heroku open - Opens the website for you project in the browser
GUI and Automatic Deployment
The Heroku website GUI can simplify several of the steps taken above especially for projects where you intend to make future changes.
#############################################

In your list of Heroku apps, select your application.
Under the Deploy tab, in the Deployment Method section, select Github. Connect to the Github repository with your application by searching for the name of your repository.
In the Manual Deploy section, click Deploy Branch to deploy for the first time.
Connect Postico to your Heroku Database
If you would like to edit your database, you can connect to your Heroku database directly from Postico.
########################################

In your list of Heroku apps, select your application.
Under Resources or in the Configure Add-Ons section, select Heroku Postgres.
Select the Settings tab and click View Credentials
Open Postico and select New Favorite.
In the new Postico favorite, update the following to match Heroku:
Host
User
Database
Password
Port
Click Connect and you should have access to your database directly from Postico!
#############################################

Resources:

More detailed instructions can be found here:

Deployment Videos
https://drive.google.com/drive/u/1/folders/0B9sCDSmGi72ZN2hpR1Etbl9qb2c
https://devcenter.heroku.com/articles/git
https://devcenter.heroku.com/articles/heroku-postgresql
