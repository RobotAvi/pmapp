import { useState, useEffect } from 'react'

/**
 * Компонент для управления аккаунтами.
 *
 * Компонент отображает форму для создания/редактирования аккаунта, а также
 * таблицу со списком всех аккаунтов. Каждая строка таблицы содержит
 * информацию об аккаунте: ID, имя, дата создания, а также кнопки для
 * редактирования и удаления аккаунта.
 *
 * @returns {JSX.Element}
 */
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

  /**
   * Обработчик события submit формы.
   *
   * Создает или обновляет аккаунт, в зависимости от значения editingId.
   * После успешной операции сбрасывает форму и обновляет список аккаунтов.
   *
   * @param {Event} e - объект события
   * @returns {Promise<void>}
   */
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

  /**
   * Создает аккаунт.
   *
   * @param {Object} account - объект с информацией об аккаунте
   * @returns {Promise<void>}
   */

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

  /**
   * Обновляет аккаунт.
   *
   * @param {number} id - ID аккаунта
   * @param {Object} accountData - объект с информацией об аккаунте
   * @returns {Promise<Object | null>}
   */
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

  /**
   * Удаляет аккаунт.
   *
   * @param {number} id - ID аккаунта
   *
   * @throws {Error} если сервер ответил ошибкой
   */
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

  /**
   * Prepares the form for editing an existing account.
   *
   * @param {Object} account - account data
   */
  const editAccount = (account) => {
    setName(account.name)
    setEditingId(account.id)
  }

  const resetForm = () => {
    setName('')
    setEditingId(null)
  }

  return (
<div className="container">
  <h1 className="my-4">Account Management</h1>
  <form onSubmit={handleSubmit} className="mb-4">
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Account Name"
        required
      />
      <button className="btn btn-primary" type="submit">
        {editingId ? 'Update' : 'Create'} Account
      </button>
      {editingId && (
        <button className="btn btn-secondary" type="button" onClick={resetForm}>
          Cancel
        </button>
      )}
    </div>
  </form>
  <div className="table-responsive">
    <table className="table table-striped table-hover">
      <thead className="table-light">
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
              <button 
                className="btn btn-sm btn-outline-primary me-2" 
                onClick={() => editAccount(account)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => deleteAccount(account.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}
