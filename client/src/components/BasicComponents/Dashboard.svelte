<script>
    import { onMount, onDestroy } from 'svelte';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import { fetchSongs } from '../../exportFunction';
    import { songs } from '../../store';
    
    let currentSongIndex = -1;
    let currentSongTitle = '';
    let currentSongArtist = '';
    let isPlaying = false;
    let audioPlayer = new Audio();
    let songDuration = 0;
    let currentTime = 0;
  
    // Stream song function
    const streamSong = async (songId, index) => {
      currentSongIndex = index;
      const song = $songs[currentSongIndex];
      currentSongTitle = song.title;
      currentSongArtist = song.artist;
      songDuration = song.duration;
  
      // API to fetch and play the song
      try {
        const response = await fetch(`http://localhost:5000/api/songs/stream/${songId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          const blob = await response.blob();
          audioPlayer.src = URL.createObjectURL(blob);
          audioPlayer.load();
          audioPlayer.play().catch((error) => console.error('Error playing song:', error));
          isPlaying = true;
        } else {
          console.error('Error streaming song');
        }
      } catch (err) {
        console.error('Error streaming song:', err);
      }
    };
  
    // Format duration (seconds to MM:SS)
    const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };
  
    const togglePlayPause = () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    };
  
    const playNextSong = () => {
      if (currentSongIndex + 1 < $songs.length) {
        streamSong($songs[currentSongIndex + 1].id, currentSongIndex + 1);
      }
    };
  
    const playPreviousSong = () => {
      if (currentSongIndex - 1 >= 0) {
        streamSong($songs[currentSongIndex - 1].id, currentSongIndex - 1);
      }
    };

    // Update currentTime as the song plays
    const updateProgress = () => {
        currentTime = audioPlayer.currentTime;
    };
  
    onMount(() => {
      fetchSongs();
      audioPlayer.addEventListener('timeupdate', updateProgress); 
      audioPlayer.addEventListener('ended', playNextSong);
    });

    onDestroy(() => {
      audioPlayer.removeEventListener('timeupdate', updateProgress);
      audioPlayer.pause();
    });
  </script>
  
  <Header />
  
  <div class="dashboard-container">
    <table class="song-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Genre</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {#each $songs as song (song.id)}
          <tr class="song-item" on:click={() => streamSong(song.id, $songs.indexOf(song))}>
            <td>{song.title}</td>
            <td>{song.artist}</td>
            <td>{song.album}</td>
            <td>{song.genre}</td>
            <td>{formatDuration(song.duration)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <Footer
    bind:currentSongTitle
    bind:currentSongArtist
    bind:songDuration
    bind:isPlaying
    bind:currentTime
    onTogglePlayPause={togglePlayPause}
    onPlayNextSong={playNextSong}
    onPlayPreviousSong={playPreviousSong}
  />
  
  <style>
    .dashboard-container {
    padding: 10px;
    width: 100%;
    min-height: calc(100vh - 120px);
    margin: 0 auto;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: url(https://cdn-icons-png.flaticon.com/512/3820/3820321.png);
    display: flex;
    justify-content: center; 
    align-items: flex-start; 
    }
  
    .song-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      font-family: 'Arial', sans-serif;
    }
  
    .song-table thead {
      background-color: #1a1a1a;
      color: #fff;
    }
  
    .song-table thead th {
      padding: 12px 20px;
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 1px;
    }
  
    .song-table tbody {
      background-color: #fafafa;
    }
  
    .song-table tbody tr {
      border-bottom: 1px solid #ddd;
    }
  
    .song-table tbody tr:hover {
      background-color: #f1f1f1;
      cursor: pointer;
    }
  
    .song-table tbody td {
      padding: 12px 20px;
      font-size: 14px;
      color: #333;
      text-align: left;
    }
  
    .song-item {
      transition: background-color 0.3s ease;
    }
  
    .song-item:hover {
      background-color: #e0e0e0;
    }
  </style>
  
  