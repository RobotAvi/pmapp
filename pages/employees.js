import EmployeesComponent from '../src/components/employees/EmployeesComponent'
import Sidebar from '../src/components/Sidebar'

export default function Employees() {
  return (
    <div className="layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1">
        <EmployeesComponent />
      </main>
    </div>
  )
}