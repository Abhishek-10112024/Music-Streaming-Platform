<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getUserSongs } from '../../exportFunction';
    import { userSongs } from '../../store';

    const navigateToDashboard = () => {
        navigate('/dashboard');
    };

    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else getUserSongs();
    });
</script>

<div class="songs-container">
    <h2>🎵 Your Songs</h2>
    {#if $userSongs.length > 0}
      <div class="song-list">
        {#each $userSongs as song}
          <div class="song-item">
            <div class="song-info">
              <strong class="song-title">{song.title}</strong> by <span class="artist-name">{song.artist}</span>
            </div>
            <div class="song-details">
              <p><strong>Album:</strong> {song.album}</p>
              <p><strong>Genre:</strong> {song.genre}</p>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="no-songs">🎧 You haven't uploaded any songs yet.</p>
    {/if}
  </div>
  
  <div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Dashboard</button>
  </div>
  
  <style>
    .songs-container {
      padding: 30px;
      background: linear-gradient(135deg, #ff7eb3, #ff758c);
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      max-width: 900px;
      margin: 40px auto;
      color: #fff;
      text-align: center;
      font-family: 'Poppins', sans-serif;
    }
  
    h2 {
      font-size: 36px;
      margin-bottom: 20px;
      color: #fff;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    }
  
    .no-songs {
      font-size: 18px;
      color: #ffe4f0;
      margin-top: 20px;
    }

    .song-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .song-item {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .song-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  
    .song-info {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  
    .song-title {
      color: #007bff;
      font-size: 20px;
      margin-right: 5px;
    }
  
    .artist-name {
      font-weight: normal;
      color: #666;
    }
  
    .song-details {
      margin-top: 12px;
      font-size: 14px;
      color: #555;
    }
  
    .song-details p {
      margin: 5px 0;
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
  
    .btn {
      padding: 12px 30px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  
    .btn:hover {
      background-color: #0056b3;
      transform: translateY(-3px);
    }
  
    .btn:focus {
      outline: none;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
    }
  
    .dashboard {
      font-weight: bold;
    }
  </style>  