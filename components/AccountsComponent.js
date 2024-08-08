import { useState, useEffect } from 'react'

export default function AccountsComponent() {
  const [accounts, setAccounts] = useState([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accountsApi')
      const data = await res.json()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const account = { name }
    
    if (editingId) {
      await updateAccount(editingId, account)
    } else {
      await createAccount(account)
    }

    resetForm()
    fetchAccounts()
  }

  const createAccount = async (account) => {
    try {
      const res = await fetch('/api/accountsApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      })
      if (!res.ok) {
        throw new Error('Failed to create account')
      }
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const updateAccount = async (id, accountData) => {
    try {
      const response = await fetch(`/api/accountsApi?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      return response.json();
    } catch (error) {
      console.error('Failed to update account:', error)
    }
  }

  const deleteAccount = async (id) => {
    try {
      const res = await fetch(`/api/accountsApi?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchAccounts(); // Обновляем список аккаунтов после успешного удаления
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }

  const editAccount = (account) => {
    setName(account.name)
    setEditingId(account.id)
  }

  const resetForm = () => {
    setName('')
    setEditingId(null)
  }

  return (
    <div>
      <h1>Account Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Account Name"
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Create'} Account</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.name}</td>
              <td>{new Date(account.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => editAccount(account)}>Edit</button>
                <button onClick={() => deleteAccount(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
