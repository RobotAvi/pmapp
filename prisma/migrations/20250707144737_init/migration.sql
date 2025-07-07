-- CreateTable
CREATE TABLE "employees" (
    "employeeid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "employmenttype" TEXT NOT NULL,
    "hiredate" DATETIME NOT NULL,
    "contactinfo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "absences" (
    "absenceid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "startdate" DATETIME NOT NULL,
    "enddate" DATETIME NOT NULL,
    "absencetype" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "absences_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skills" (
    "skillid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skillname" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "employeeskills" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "skillid" INTEGER NOT NULL,
    "proficiencylevel" INTEGER NOT NULL,
    CONSTRAINT "employeeskills_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "employeeskills_skillid_fkey" FOREIGN KEY ("skillid") REFERENCES "skills" ("skillid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "employeelevels" (
    "levelid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "assignmentdate" DATETIME NOT NULL,
    CONSTRAINT "employeelevels_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "motivators" (
    "motivatorid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "motivatorname" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "employeemotivators" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "motivatorid" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    CONSTRAINT "employeemotivators_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "employeemotivators_motivatorid_fkey" FOREIGN KEY ("motivatorid") REFERENCES "motivators" ("motivatorid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "performancereviews" (
    "reviewid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "reviewdate" DATETIME NOT NULL,
    "rating" REAL NOT NULL,
    "comments" TEXT NOT NULL,
    CONSTRAINT "performancereviews_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "salaries" (
    "salaryid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeid" INTEGER NOT NULL,
    "startdate" DATETIME NOT NULL,
    "enddate" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    CONSTRAINT "salaries_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projects" (
    "projectid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startdate" DATETIME NOT NULL,
    "plannedenddate" DATETIME NOT NULL,
    "status_id" INTEGER NOT NULL,
    "accountid" INTEGER NOT NULL,
    CONSTRAINT "projects_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "projectstatuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_accountid_fkey" FOREIGN KEY ("accountid") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projectstatuses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projectassignments" (
    "assignmentid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectid" INTEGER NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "startdate" DATETIME NOT NULL,
    "enddate" DATETIME NOT NULL,
    "role" TEXT NOT NULL,
    "allocationpercentage" REAL NOT NULL,
    CONSTRAINT "projectassignments_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "projects" ("projectid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projectassignments_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "employees" ("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resourceplanning" (
    "planningid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectid" INTEGER NOT NULL,
    "plannedstartdate" DATETIME NOT NULL,
    "plannedenddate" DATETIME NOT NULL,
    "requiredrole" TEXT NOT NULL,
    "requiredskills" TEXT NOT NULL,
    "requiredemployeecount" INTEGER NOT NULL,
    CONSTRAINT "resourceplanning_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "projects" ("projectid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "stakeholders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("projectid") ON DELETE RESTRICT ON UPDATE CASCADE
);
