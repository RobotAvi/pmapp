// pages/accounts.js
import AccountsComponent from '../components/AccountsComponent'
import Sidebar from '../components/Sidebar'

export default function Accounts() {
  return (
    <div className="layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1">
        <AccountsComponent />
      </main>
    </div>
  )
}
