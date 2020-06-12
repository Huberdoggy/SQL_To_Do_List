-- create our table
CREATE TABLE "tasks" (
	--define our columns
	"id" SERIAL PRIMARY KEY, -- GIVES EACH TASK A UNIQUE NUMBER!!!
	"name" VARCHAR(250) NOT NULL,
	"duedate" DATE,
	"status" BOOLEAN DEFAULT FALSE
);

INSERT INTO "tasks" ("name", "duedate", "status") VALUES ('Finish Weekend Challenge 3', '05-31-2020', false);
INSERT INTO "tasks" ("name", "duedate", "status") VALUES ('Creat PSP Prezzy', '06-03-2020', false);
INSERT INTO "tasks" ("name", "duedate", "status") VALUES ('Re-stock on groceries', '06-04-2020', false);
INSERT INTO "tasks" ("name", "duedate", "status") VALUES ('Get gas', '06-04-2020', false);

--DROP TABLE "tasks";
