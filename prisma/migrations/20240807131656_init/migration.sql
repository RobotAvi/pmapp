-- CreateTable
CREATE TABLE "Project" (
    "projectid" SERIAL NOT NULL,
    "projectname" TEXT NOT NULL,
    "description" TEXT,
    "startdate" TIMESTAMP(3) NOT NULL,
    "plannedenddate" TIMESTAMP(3) NOT NULL,
    "status_id" INTEGER NOT NULL,
    "accountid" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectid")
);

-- CreateTable
CREATE TABLE "ProjectStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAssignment" (
    "assignmentid" SERIAL NOT NULL,
    "projectid" INTEGER NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3) NOT NULL,
    "allocationpercentage" INTEGER NOT NULL,

    CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("assignmentid")
);

-- CreateTable
CREATE TABLE "ResourcePlanning" (
    "planningid" SERIAL NOT NULL,
    "projectid" INTEGER NOT NULL,
    "requiredrole" TEXT NOT NULL,
    "requiredskills" TEXT NOT NULL,
    "requiredemployeecount" INTEGER NOT NULL,
    "plannedstartdate" TIMESTAMP(3) NOT NULL,
    "plannedenddate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourcePlanning_pkey" PRIMARY KEY ("planningid")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeid" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "employmenttype" TEXT NOT NULL,
    "hiredate" TIMESTAMP(3) NOT NULL,
    "contactinfo" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeid")
);

-- CreateTable
CREATE TABLE "EmployeeSkill" (
    "id" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "skillid" INTEGER NOT NULL,
    "proficiencylevel" INTEGER NOT NULL,

    CONSTRAINT "EmployeeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "skillid" SERIAL NOT NULL,
    "skillname" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skillid")
);

-- CreateTable
CREATE TABLE "EmployeeMotivator" (
    "id" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "motivatorid" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "EmployeeMotivator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motivator" (
    "motivatorid" SERIAL NOT NULL,
    "motivatorname" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Motivator_pkey" PRIMARY KEY ("motivatorid")
);

-- CreateTable
CREATE TABLE "EmployeeLevel" (
    "levelid" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "assignmentdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeLevel_pkey" PRIMARY KEY ("levelid")
);

-- CreateTable
CREATE TABLE "Absence" (
    "absenceid" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3) NOT NULL,
    "absencetype" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("absenceid")
);

-- CreateTable
CREATE TABLE "Salary" (
    "salaryid" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3),

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("salaryid")
);

-- CreateTable
CREATE TABLE "PerformanceReview" (
    "reviewid" SERIAL NOT NULL,
    "employeeid" INTEGER NOT NULL,
    "reviewdate" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,

    CONSTRAINT "PerformanceReview_pkey" PRIMARY KEY ("reviewid")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "ProjectStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_accountid_fkey" FOREIGN KEY ("accountid") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Project"("projectid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourcePlanning" ADD CONSTRAINT "ResourcePlanning_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Project"("projectid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("projectid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_skillid_fkey" FOREIGN KEY ("skillid") REFERENCES "Skill"("skillid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeMotivator" ADD CONSTRAINT "EmployeeMotivator_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeMotivator" ADD CONSTRAINT "EmployeeMotivator_motivatorid_fkey" FOREIGN KEY ("motivatorid") REFERENCES "Motivator"("motivatorid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLevel" ADD CONSTRAINT "EmployeeLevel_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_employeeid_fkey" FOREIGN KEY ("employeeid") REFERENCES "Employee"("employeeid") ON DELETE RESTRICT ON UPDATE CASCADE;
