const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create project statuses
  const statusActive = await prisma.projectStatus.create({
    data: {
      status: 'Active',
      description: 'Project is currently active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const statusCompleted = await prisma.projectStatus.create({
    data: {
      status: 'Completed',
      description: 'Project has been completed',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const statusOnHold = await prisma.projectStatus.create({
    data: {
      status: 'On Hold',
      description: 'Project is temporarily on hold',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Create accounts
  const techCorp = await prisma.account.create({
    data: {
      name: 'TechCorp Solutions',
      createdAt: new Date(),
    },
  })

  const innovateInc = await prisma.account.create({
    data: {
      name: 'Innovate Inc.',
      createdAt: new Date(),
    },
  })

  const digitalVentures = await prisma.account.create({
    data: {
      name: 'Digital Ventures',
      createdAt: new Date(),
    },
  })

  // Create projects
  await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Development of a modern e-commerce platform with advanced features',
      startDate: new Date('2024-01-15'),
      plannedEndDate: new Date('2024-06-30'),
      statusId: statusActive.id,
      accountId: techCorp.id,
    },
  })

  await prisma.project.create({
    data: {
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application for iOS and Android',
      startDate: new Date('2024-02-01'),
      plannedEndDate: new Date('2024-08-15'),
      statusId: statusActive.id,
      accountId: innovateInc.id,
    },
  })

  await prisma.project.create({
    data: {
      name: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard for data visualization',
      startDate: new Date('2023-10-01'),
      plannedEndDate: new Date('2024-01-31'),
      statusId: statusCompleted.id,
      accountId: digitalVentures.id,
    },
  })

  // Create skills
  const jsSkill = await prisma.skill.create({
    data: {
      skillName: 'JavaScript',
      description: 'JavaScript programming language',
    },
  })

  const reactSkill = await prisma.skill.create({
    data: {
      skillName: 'React',
      description: 'React frontend framework',
    },
  })

  const nodeSkill = await prisma.skill.create({
    data: {
      skillName: 'Node.js',
      description: 'Node.js backend development',
    },
  })

  // Create motivators
  const growth = await prisma.motivator.create({
    data: {
      motivatorName: 'Professional Growth',
      description: 'Opportunities for learning and career advancement',
    },
  })

  const collaboration = await prisma.motivator.create({
    data: {
      motivatorName: 'Team Collaboration',
      description: 'Working with talented team members',
    },
  })

  // Create employees
  const john = await prisma.employee.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      position: 'Senior Developer',
      employmentType: 'Full-time',
      hireDate: new Date('2023-01-15'),
      contactInfo: 'john.doe@company.com',
    },
  })

  const jane = await prisma.employee.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      position: 'Project Manager',
      employmentType: 'Full-time',
      hireDate: new Date('2022-05-10'),
      contactInfo: 'jane.smith@company.com',
    },
  })

  const mike = await prisma.employee.create({
    data: {
      firstName: 'Mike',
      lastName: 'Johnson',
      position: 'Frontend Developer',
      employmentType: 'Contract',
      hireDate: new Date('2023-09-01'),
      contactInfo: 'mike.johnson@company.com',
    },
  })

  // Create employee skills
  await prisma.employeeSkill.create({
    data: {
      employeeId: john.id,
      skillId: jsSkill.id,
      proficiencyLevel: 5,
    },
  })

  await prisma.employeeSkill.create({
    data: {
      employeeId: john.id,
      skillId: nodeSkill.id,
      proficiencyLevel: 4,
    },
  })

  await prisma.employeeSkill.create({
    data: {
      employeeId: mike.id,
      skillId: reactSkill.id,
      proficiencyLevel: 4,
    },
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })