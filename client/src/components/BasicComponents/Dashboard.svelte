<script>
    import { onMount, onDestroy } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import { fetchLikedSongs, fetchSongs } from '../../exportFunction';
    import { songs, likes } from '../../store';
    import ReportSong from '../SongComponents/ReportSong.svelte';

    let selectedSongId = null; 
    let isModalOpen = false; 
    let currentSongIndex = -1;
    let currentSongTitle = '';
    let currentSongArtist = '';
    let isPlaying = false;
    let audioPlayer = new Audio();
    let songDuration = 0;
    let currentTime = 0;
  
    // Open the modal and set the selected song ID
    const openReportModal = (songId) => {
        selectedSongId = songId;
        isModalOpen = true;
    };

    // Close the modal
    const closeModal = () => {
        isModalOpen = false;
        selectedSongId = null;
    };
  
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

    const handleRowClick = (songId, index) => {
        streamSong(songId, index);
    };

    // Function to toggle the like status of a song
    const toggleLike = (songId) => {
        if ($likes.includes(songId)) {
            removeFromLiked(songId);
        } else {
            addToLiked(songId);
        }
    };

    // Add a song to the liked list
    async function addToLiked(songId) {
        try {
            const response = await fetch('http://localhost:5000/api/playlists/liked-songs/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ songId }),
            });
            if (response.ok) {
                likes.update(currentLikes => [...currentLikes, songId]);
            } else {
                alert('Failed to add song');
            }
        } catch (err) {
            alert('Error adding song');
        }
    }

    // Remove a song from the liked list
    async function removeFromLiked(songId) {
        try {
            const response = await fetch('http://localhost:5000/api/playlists/liked-songs/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ songId }),
            });
            if (response.ok) {
                likes.update(currentLikes => currentLikes.filter(id => id !== songId));
            } else {
                alert('Failed to remove song');
            }
        } catch (err) {
            alert('Error removing song');
        }
    }
  
    onMount(() => {
      const token = localStorage.getItem('token')
        if (!token)
        navigate ('/');

      fetchSongs();
      fetchLikedSongs();
      console.log($likes);
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
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each $songs as song (song.id)}
          <tr class="song-item" on:click={() => handleRowClick(song.id, $songs.indexOf(song))}>
            <td>{song.title}</td>
            <td>{song.artist}</td>
            <td>{song.album}</td>
            <td>{song.genre}</td>
            <td>{formatDuration(song.duration)}</td>
            <td>
              <button 
                class="heart-icon" 
                on:click={(e) => {
                  e.stopPropagation();
                  toggleLike(song.id); // Toggle the like status
                }}>
                {#if $likes.includes(song.id)}
                  ❤️
                {:else}
                  🤍
                {/if}
              </button>
              <button class="report-button" on:click={(e) => { 
                  e.stopPropagation(); // Prevent the row click from triggering streaming
                  openReportModal(song.id); // Open the report modal
              }}>Report</button>
          </td>
          </tr>
        {/each}
      </tbody>
    </table>
</div>
{#if isModalOpen}
    <ReportSong {selectedSongId} close={closeModal} />
{/if}
  
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
      text-align: center;
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
      text-align: center;
    }
  
    .song-item {
      transition: background-color 0.3s ease;
    }
  
    .song-item:hover {
      background-color: #e0e0e0;
    }
    .report-button {
      background-color: #ff6f61;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      text-align: center;
    }
    .report-button:hover {
        background-color: #e24d42;
        transform: translateY(-2px);
    }

    .report-button:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(255, 111, 97, 0.8);
    }

    .report-button:active {
        background-color: #d14c39;
        transform: translateY(0);
    }
    .heart-icon {
      cursor: pointer;
      transition: color 0.3s ease;
      border: none;
      font-size: large;
    }
</style>
  
  