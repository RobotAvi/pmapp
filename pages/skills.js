import SkillsComponent from '../src/components/skills/SkillsComponent'
import Sidebar from '../src/components/Sidebar'

export default function Skills() {
  return (
    <div className="layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1">
        <SkillsComponent />
      </main>
    </div>
  )
}