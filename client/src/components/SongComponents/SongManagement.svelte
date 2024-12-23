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
    <h1>🎵 Song Management</h1>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    {#if successMessage}
        <p class="success">{successMessage}</p>
    {/if}

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
                      <button class="delete-btn" on:click={() => deleteSong(song.id)}>🗑️ Delete</button>
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
    .song-management {
      padding: 40px;
      background: linear-gradient(135deg, #56ccf2, #2f80ed);
      border-radius: 20px;
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
      max-width: 1200px;
      margin: 40px auto;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      text-align: center;
    }
  
    h1 {
      font-size: 32px;
      color: #fff;
      margin-bottom: 30px;
      font-weight: 600;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
    }

    .error, .success {
      padding: 15px;
      border-radius: 10px;
      font-size: 16px;
      text-align: center;
      margin-top: 20px;
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
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
      margin-top: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
  
    .song-table thead {
      background-color: #333;
      color: white;
    }
  
    .song-table th, .song-table td {
      padding: 15px;
      text-align: center;
      font-size: 16px;
    }
  
    .song-table th {
      font-weight: bold;
      text-transform: uppercase;
    }
  
    .song-table tbody {
      background-color: #fff;
    }
  
    .song-table tbody tr {
      border-bottom: 1px solid #ddd;
    }
  
    .song-table tbody tr:last-child {
      border-bottom: none;
    }
  
    .song-table tbody td {
      color: #333;
    }
  
    .song-table tbody tr:hover {
      background-color: #f5f5f5;
    }

    .delete-btn {
      padding: 10px 20px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 8px;
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
  