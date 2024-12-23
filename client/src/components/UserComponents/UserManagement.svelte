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
    <h1>👥 User Management</h1>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    {#if successMessage}
        <p class="success">{successMessage}</p>
    {/if}

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
                      <button class="delete-btn" on:click={() => deleteUser(user.id)}>🗑️ Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
  
    <div class="button-container">
        <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Admin Dashboard</button>
    </div>
  </div>
  
  <style>
    .user-management {
      padding: 35px;
      background: linear-gradient(135deg, #56ccf2, #2f80ed);
      border-radius: 15px;
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
      max-width: 1200px;
      margin: 40px auto;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      text-align: center;
    }
  
    h1 {
      font-size: 28px;
      color: #fff;
      margin-bottom: 30px;
      font-weight: 600;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    }
  
    .error, .success {
      padding: 15px;
      border-radius: 8px;
      font-size: 16px;
      text-align: center;
      margin-top: 15px;
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
      margin-top: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
  
    .user-table thead {
      background-color: #2f80ed;
      color: white;
    }
  
    .user-table th, .user-table td {
      padding: 14px;
      text-align: center;
      font-size: 16px;
    }
  
    .user-table th {
      font-weight: bold;
      text-transform: uppercase;
    }
  
    .user-table tbody {
      background-color: #fff;
    }
  
    .user-table tbody tr {
      border-bottom: 1px solid #ddd;
    }
  
    .user-table tbody tr:last-child {
      border-bottom: none;
    }
  
    .user-table tbody td {
      color: #333;
    }
  
    .user-table tbody tr:hover {
      background-color: #f5f5f5;
    }
  
    .delete-btn {
      padding: 8px 20px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s, transform 0.3s;
    }
  
    .delete-btn:hover {
      background-color: #e02f2f;
      transform: translateY(-2px);
    }
  
    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 35px;
    }
  
    .btn {
      padding: 14px 30px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      background-color: #007bff;
      color: white;
      transition: background-color 0.3s, transform 0.3s;
    }
  
    .btn:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }
  </style>
  