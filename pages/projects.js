// pages/projects.js
import ProjectsComponent from '../src/components/projects/ProjectsComponent'
import Sidebar from '../src/components/Sidebar'

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
