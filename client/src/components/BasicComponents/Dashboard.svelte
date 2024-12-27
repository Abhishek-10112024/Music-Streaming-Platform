<script>
    import { onMount, onDestroy } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import { fetchSongs, fetchUserPlaylists, fetchLikedSongs, searchSongs } from '../../exportFunction';
    import { songs, likes, playlists,searchResults } from '../../store';
    import ReportSong from '../SongComponents/ReportSong.svelte';

    let selectedSongId = null; 
    let isModalOpen = false; 
    let currentSongIndex = -1;
    let currentSongTitle = '';
    let currentSongArtist = '';
    let isPlaying = false;
    let audioPlayer = new Audio(); //This creates a new instance of the Audio object, which is a built-in JavaScript class representing an HTML5 <audio> element
    let songDuration = 0;
    let currentTime = 0;
    let showPlaylists = false;
    let fetchedPlaylists = [];
    let searchQuery = '';
    let displaySongs = $songs;

    // Reactive statement to update displaySongs dynamically
    $: displaySongs = $searchResults.length > 0 ? $searchResults : $songs; //true: $searchResults to displaySongs & false: $songs to displaySongs

     // Handle search submission
     const handleSearch = async () => {
        if (searchQuery.trim()) { // Removes the leading and trailing white space and line terminator characters from a string
            await searchSongs(searchQuery); 
            displaySongs = $searchResults; 
        } else {
            displaySongs = $songs; 
        }
    };

    // Clear search and reset to default songs
    const clearSearch = () => {
        searchQuery = '';
        searchResults.set([]); 
        displaySongs = $songs; 
    };
  
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
        currentSongIndex = index; //Sets the index of the current song in the playlist.
        const song = $songs[currentSongIndex]; //Retrieves the song object from the $songs array based on the current index
        currentSongTitle = song.title;
        currentSongArtist = song.artist;
        songDuration = song.duration;

      try {
        const response = await fetch(`http://localhost:5000/api/songs/stream/${songId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          const blob = await response.blob(); //The server returns the song file as a blob (a binary large object).
          audioPlayer.src = URL.createObjectURL(blob); //The blob is converted into a URL that can be used as the source for the audio player (audioPlayer is an <audio> HTML element).
          audioPlayer.load(); //This reloads the audio element to use the new song source
          audioPlayer.play().catch((error) => console.error('Error playing song:', error)); //audioPlayer.play();: Starts playing the song.
          isPlaying = true; //Marks the song as playing
        } else {
          console.error('Error streaming song');
        }
      } catch (err) {
        console.error('Error streaming song:', err);
      }
    };
  
    // Format duration (seconds to MM:SS)
    const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60); //floor: Returns the greatest integer less than or equal to its numeric argument
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${String(seconds).padStart(2, '0')}`; //Converts the seconds value into a string and pads it with leading zeros to ensure it is always two digits (e.g., 9 becomes 09)
    };
  
    //toggle play/pause function
    const togglePlayPause = () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        audioPlayer.play(); //Loads and starts playback of a media resource
      } else {
        audioPlayer.pause(); //Pauses the current playback and sets paused to TRUE
      }
    };

    // play next song
    const playNextSong = () => {
      if (currentSongIndex + 1 < $songs.length) { //Ensures that the current song is not the last song in the playlist
        streamSong($songs[currentSongIndex + 1].id, currentSongIndex + 1); //ID and Index of next song
      }
    };
  
    // play previous song
    const playPreviousSong = () => {
      if (currentSongIndex - 1 >= 0) { //Ensures that the current song is not the first song in the playlist
        streamSong($songs[currentSongIndex - 1].id, currentSongIndex - 1);
      }
    };

    // Update currentTime as the song plays
    const updateProgress = () => {
        currentTime = audioPlayer.currentTime; // audioPlayer.currentTime: Gets or sets the current playback position, in seconds
    };

    // play song on click
    const handleRowClick = (songId, index) => {
        streamSong(songId, index);
    };

    // Seek to a specific time in the song
    const seekTo = (time) => {
        audioPlayer.currentTime = time; //moves the playback to the specified position
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
                likes.update(currentLikes => [...currentLikes, songId]); //Takes the current value of likes (likely an array) as input (currentLikes) & Returns a new array that includes all the existing likes and appends the songId
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
                likes.update(currentLikes => currentLikes.filter(id => id !== songId)); //currentLikes: Represents the current array of liked song IDs & filter: Creates a new array by keeping only the IDs that do not match the songId
            } else {
                alert('Failed to remove song');
            }
        } catch (err) {
            alert('Error removing song');
        }
    }

    // toggle playlist dropdown    
    const togglePlaylistsDropdown = (songId) => {
        selectedSongId = songId;
        showPlaylists = !showPlaylists;
        if (showPlaylists && fetchedPlaylists.length === 0) {
            fetchUserPlaylists(); 
        }
    };

    // Add a song to a playlist
    const addSongToPlaylist = async (playlistId) => {
        try {
            const response = await fetch('http://localhost:5000/api/playlists/add-song', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId, songId: selectedSongId }),
            });

            if (response.ok) {
                alert('Song added to playlist!');
            } else {
                alert('Failed to add song to playlist.');
            }
        } catch (err) {
            console.error('Error adding song to playlist:', err);
        }
    };
  
    onMount(() => {
      const token = localStorage.getItem('token')
        if (!token)
        navigate ('/');

      fetchSongs();
      fetchLikedSongs();
      audioPlayer.addEventListener('timeupdate', updateProgress); // timeupdate listener ensures real-time updates to the UI
      audioPlayer.addEventListener('ended', playNextSong); // ended listener automates transitions to the next song
    });

    onDestroy(() => {
      audioPlayer.removeEventListener('timeupdate', updateProgress); //The function passed to removeEventListener must exactly match the one added with addEventListener & Removes the previously attached timeupdate event listener from the audioPlayer object & If the listener is no longer needed, removing it avoids unnecessary memory usage
      audioPlayer.pause(); ////Pauses the current playback and sets paused to TRUE
    });
</script>
  
<Header />
  
<div class="dashboard-wrapper">
    <div class="dashboard-container">
        <div class="search-container">
            <input 
        type="text" 
        bind:value={searchQuery} 
        placeholder="Search for songs..." 
    />
    <button on:click={handleSearch}>Search</button>
    <button on:click={clearSearch}>Clear</button>
        </div>
        <div class="song-grid">
            {#if displaySongs.length > 0}
                {#each displaySongs as song (song.id)}
                <div 
                    class="song-card" 
                    role="button" 
                    tabindex="0" 
                    on:click={() => handleRowClick(song.id, displaySongs.indexOf(song))} 
                    on:keydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleRowClick(song.id, displaySongs.indexOf(song));
                        }
                    }}>
                    <div class="song-card-header">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                    </div>
                    <div class="song-card-body">
                        <p><strong>Album:</strong> {song.album}</p>
                        <p><strong>Genre:</strong> {song.genre}</p>
                        <p><strong>Duration:</strong> {formatDuration(song.duration)}</p>
                    </div>
                    <div class="song-card-actions">
                        <button
                            class="heart-icon"
                            on:click={(e) => {
                                e.stopPropagation();
                                toggleLike(song.id);
                            }}
                            aria-label={$likes.includes(song.id) ? 'Unlike song' : 'Like song'}>
                            {#if $likes.includes(song.id)}
                                ❤️
                            {:else}
                                🤍
                            {/if}
                        </button>
                        <button
                            on:click={(e) => {
                                e.stopPropagation();
                                togglePlaylistsDropdown(song.id);
                            }}
                            aria-expanded={showPlaylists && selectedSongId === song.id}
                            aria-label="Add song to playlist">
                            📂
                        </button>
                        {#if showPlaylists && selectedSongId === song.id}
                            <div class="playlist-dropdown" role="menu">
                                {#each $playlists as playlist}
                                    <button
                                        class="playlist-item"
                                        role="menuitem"
                                        on:click={(e) => {
                                            e.stopPropagation();
                                            addSongToPlaylist(playlist.id);
                                            showPlaylists = false;
                                        }}>
                                        {playlist.name}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                        <button
                            class="report-button"
                            on:click={(e) => {
                                e.stopPropagation();
                                openReportModal(song.id);
                            }}
                            aria-label="Report song">
                            Report
                        </button>
                    </div>
                </div>
                {/each}
                {:else}
                    <p>No songs found matching your search query.</p>
                {/if}
        </div>
    </div>
</div>
{#if isModalOpen}
    <ReportSong {selectedSongId} close={closeModal} />
{/if}

<Footer
    {currentSongTitle}
    {currentSongArtist}
    {isPlaying}
    {songDuration}
    {currentTime}
    onTogglePlayPause={togglePlayPause}
    onPlayNextSong={playNextSong}
    onPlayPreviousSong={playPreviousSong}
    onSeek={seekTo}
/>

<style>
    .dashboard-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh; 
        overflow: hidden;
        padding-bottom: 60%;
    }

    .dashboard-container {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        width: 100%;
        margin: 0 auto;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(88,9,121,1) 35%, rgba(0,212,255,1) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding-top: 650px;
        padding-bottom: 80px;
    }

    .song-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        width: 100%;
    }

    .song-card {
        background-color: aliceblue;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .song-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }

    .song-card-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    .song-card-header p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #666;
    }

    .song-card-body {
        margin-top: 10px;
        font-size: 14px;
        color: #333;
    }

    .song-card-body p {
        margin: 5px 0;
    }

    .song-card-actions {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .heart-icon {
        cursor: pointer;
        transition: color 0.3s ease;
        border: none;
        font-size: 20px;
        background: none;
    }

    .heart-icon:hover {
        color: #ff6347;
    }

    .playlist-dropdown {
        background-color: #fff;
        position: absolute;
        top: 100%;
        left: 0;
        width: 200px;
        padding: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        z-index: 9999;
    }

    .playlist-item {
        padding: 8px 10px;
        font-size: 14px;
        color: #333;
        background-color: transparent;
        border: none;
        width: 100%;
        text-align: left;
        transition: background-color 0.2s ease;
    }

    .playlist-item:hover {
        background-color: #f1f1f1;
        cursor: pointer;
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
    .search-container {
        display: flex;
        margin-bottom: 20px;
    }
    .search-container input {
        flex: 1;
        padding: 8px;
        margin-right: 10px;
    }
    .search-container button {
        padding: 8px;
    }
</style>