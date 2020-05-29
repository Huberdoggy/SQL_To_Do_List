-- create our table
CREATE TABLE "tasks" (
	--define our columns
	"id" SERIAL PRIMARY KEY, -- GIVES EACH TASK A UNIQUE NUMBER!!!
	"name" VARCHAR(250) NOT NULL,
	"duedate" DATE,
	"status" VARCHAR(80)
);

INSERT INTO "tasks" ("name", "duedate") VALUES ('Finish Weekend Challenge 3', '05-31-2020');
INSERT INTO "tasks" ("name", "duedate") VALUES ('Creat PSP Prezzy', '06-03-2020');
INSERT INTO "tasks" ("name", "duedate") VALUES ('Re-stock on groceries', '06-04-2020');
INSERT INTO "tasks" ("name", "duedate") VALUES ('Get gas', '06-04-2020');
