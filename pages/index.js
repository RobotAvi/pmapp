import Sidebar from '../src/components/Sidebar'
import Dashboard from '../src/components/Dashboard';

export default function Home() {
  return (
    <div className="layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1">
        <Dashboard />
      </main>
    </div>
  )
}