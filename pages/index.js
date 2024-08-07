import Sidebar from '../components/Sidebar'
import ProjectsComponent from '../components/ProjectsComponent'

export default function Home() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <ProjectsComponent />
      </main>
    </div>
  )
}

