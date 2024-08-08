import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard';

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