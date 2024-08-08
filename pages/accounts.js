// pages/accounts.js
import AccountsComponent from '../components/AccountsComponent'
import Sidebar from '../components/Sidebar'

export default function Accounts() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <AccountsComponent />
      </main>
    </div>
  )
}
