// pages/accounts.js
import AccountsComponent from '../src/components/accounts/AccountsComponent'
import Sidebar from '../src/components/Sidebar'

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
