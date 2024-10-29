
/**
 * The AccountService class provides a set of methods for managing accounts, 
 * including creating, updating, and deleting accounts. It acts as an interface 
 * to the /api/accountsApi endpoint, handling requests and responses for 
 * account-related operations.
 */

class AccountService {
  /**
   * Creates a new account
   * @param {Object} account - account to create
   * @throws {Error} if failed to create account
   */
  async createAccount(account) {
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
   * Updates an existing account
   * @param {number} id - account id to update
   * @param {Object} accountData - account data to update
   * @throws {Error} if failed to update account
   * @returns {Promise<import('next').NextApiRequest>} - updated account
   */
  async updateAccount(id, accountData) {
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
   * Deletes an existing account
   * @param {number} id - account id to delete
   * @throws {Error} if failed to delete account
   */
  async deleteAccount(id) {
    try {
      const res = await fetch(`/api/accountsApi?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Обновляем список аккаунтов после успешного удаления
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }
}

export default AccountService;