<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchSongs } from '../../exportFunction';
    import { songs } from '../../store';
  
    let errorMessage = '';
    let successMessage = '';
  
    // Delete a song
    const deleteSong = async (songId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/songs/${songId}`, {
            method: 'DELETE',
            headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            credentials: 'include'
        });
  
        if (response.ok) {
        successMessage = 'Song deleted successfully!';
        songs.update(currentSong => currentSong.filter(song => song.id !== songId));
      } else {
        const data = await response.json();
        errorMessage = data.message || 'Failed to delete song.';
      }
    } catch (error) {
      errorMessage = 'Error deleting song.';
    }
    };

    const navigateToDashboard = () => {
    navigate('/dashboard')
    };
  
    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate('/')
    else;
        fetchSongs();
    });
  </script>

<div class="song-management">
  <h1>Song Management</h1>
  
  <!-- Error and Success Message Display -->
  {#if errorMessage}
      <p class="error">{errorMessage}</p>
  {/if}
  {#if successMessage}
      <p class="success">{successMessage}</p>
  {/if}

  <!-- song Table -->
  <table class="song-table">
      <thead>
          <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Action</th>
          </tr>
      </thead>
      <tbody>
          {#each $songs as song (song.id)}
              <tr>
                  <td>{song.id}</td>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.album}</td>
                  <td>
                    <button class="delete-btn" on:click={() => deleteSong(song.id)}>Delete</button>
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
  .song-management {
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

  .song-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-top: 30px;
  }

  .song-table thead {
      background-color: #333;
      color: white;
  }

  .song-table th, .song-table td {
      padding: 12px;
      text-align: center;
      font-size: 15px;
  }

  .song-table th {
      font-weight: bold;
      text-transform: uppercase;
  }

  .song-table tbody {
      background-color: #fff;
  }

  .song-table tbody tr {
      border-bottom: 1px solid #eee;
  }

  .song-table tbody tr:last-child {
      border-bottom: none;
  }

  .song-table tbody td {
      color: #333;
      font-size: 14px;
  }

  .song-table tbody tr:hover {
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
