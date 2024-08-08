// pages/projects.js
import ProjectsComponent from '../components/ProjectsComponent'
import Sidebar from '../components/Sidebar'

export default function Projects() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <ProjectsComponent />
      </main>
    </div>
  )
}
