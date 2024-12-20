<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { fetchUsers } from '../../exportFunction';
  import { users } from '../../store';

  let errorMessage = '';
  let successMessage = '';

  // Handle user deletion
  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        successMessage = 'User deleted successfully!';
        users.update(currentUsers => currentUsers.filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        errorMessage = data.message || 'Failed to delete user.';
      }
    } catch (error) {
      errorMessage = 'Error deleting user.';
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    else fetchUsers();
  });
</script>

<div class="user-management">
  <h1>User Management</h1>
  
  <!-- Error and Success Message Display -->
  {#if errorMessage}
      <p class="error">{errorMessage}</p>
  {/if}
  {#if successMessage}
      <p class="success">{successMessage}</p>
  {/if}

  <!-- User Table -->
  <table class="user-table">
      <thead>
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
          </tr>
      </thead>
      <tbody>
          {#each $users as user (user.id)}
              <tr>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button class="delete-btn" on:click={() => deleteUser(user.id)}>Delete</button>
                  </td>
              </tr>
          {/each}
      </tbody>
  </table>

  <div class="button-container">
      <button class="btn dashboard" on:click={navigateToDashboard}>Back to Admin Dashboard</button>
  </div>
</div>

<style>
  .user-management {
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
      max-width: 1100px;
      margin: 30px auto;
      background: url(https://cdn-icons-png.flaticon.com/512/3820/3820321.png);
      color: #fff;
  }

  h1 {
      font-family: 'Roboto', sans-serif;
      margin-bottom: 25px;
      color: #333;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
  }

  .error, .success {
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      font-size: 14px;
      margin-bottom: 20px;
  }

  .error {
      background-color: #f8d7da;
      color: #721c24;
  }

  .success {
      background-color: #d4edda;
      color: #155724;
  }

  .user-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-top: 30px;
  }

  .user-table thead {
      background-color: #333;
      color: white;
  }

  .user-table th, .user-table td {
      padding: 12px;
      text-align: center;
      font-size: 15px;
  }

  .user-table th {
      font-weight: bold;
      text-transform: uppercase;
  }

  .user-table tbody {
      background-color: #fff;
  }

  .user-table tbody tr {
      border-bottom: 1px solid #eee;
  }

  .user-table tbody tr:last-child {
      border-bottom: none;
  }

  .user-table tbody td {
      color: #333;
      font-size: 14px;
  }

  .user-table tbody tr:hover {
      background-color: #f1f1f1;
  }

  .delete-btn {
      padding: 8px 15px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease, transform 0.3s;
  }

  .delete-btn:hover {
      background-color: #e02f2f;
      transform: translateY(-2px);
  }

  .button-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
  }

  .btn {
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease, transform 0.3s;
      margin: 0 15px;
      background-color: #007bff;
      color: white;
  }

  .btn:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
  }
</style>
