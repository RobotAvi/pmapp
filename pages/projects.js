// pages/projects.js
import ProjectsComponent from '../components/ProjectsComponent'
import Sidebar from '../components/Sidebar'

export default function Projects() {
  return (
    <div className="layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1">
        <ProjectsComponent />
      </main>
    </div>
  )
}
