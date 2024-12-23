<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchPlaylistSongs, fetchUserPlaylists } from '../../exportFunction';
    import { playlistSongs, playlists } from '../../store';

    let selectedPlaylist = '';
    let playlistName = '';
    let playlistDescription = '';
    let errorMessage = '';
    let successMessage = '';

    // Create a new playlist
    const createPlaylist = async () => {
        if (!playlistName || !playlistDescription) {
            errorMessage = 'Please provide both name and description for the playlist.';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/playlists', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playlistName, description: playlistDescription }),
            });

            const data = await response.json();
            if (response.ok) {
                successMessage = data.message;
                fetchUserPlaylists(); // Refresh the playlists
                playlistName = '';
                playlistDescription = '';
            } else {
                errorMessage = data.message || 'Error creating playlist';
            }
        } catch (err) {
            errorMessage = 'Error creating playlist';
        }
    };

    // Fetch songs of a specific playlist
    const fetchSongsOfPlaylist = async (playlistId) => {
        try {
            await fetchPlaylistSongs(playlistId); 
            selectedPlaylist = playlistId; 
        } catch (err) {
            errorMessage = 'Error fetching playlist songs';
        }
    };

    // Remove a song from a playlist
    const removeSong = async (songId) => {
        try {
            const response = await fetch('http://localhost:5000/api/playlists/remove-song', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId: selectedPlaylist, songId }),
            });

            if (response.ok) {
                successMessage = 'Song removed from playlist.';
                fetchSongsOfPlaylist(selectedPlaylist);
            } else {
                errorMessage = 'Error removing song.';
            }
        } catch (err) {
            errorMessage = 'Error removing song.';
        }
    };

    // Delete a playlist
    const deletePlaylist = async (playlistId) => {
        if (!playlistId) return;
        try {
            const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                successMessage = data.message;
                fetchUserPlaylists(); // Refresh the playlists
            } else {
                errorMessage = data.message || 'Error deleting playlist';
            }
        } catch (err) {
            errorMessage = 'Error deleting playlist';
        }
    };

    // Navigate to Dashboard
    const navigateToDashboard = () => {
        navigate('/dashboard');
    };


    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchUserPlaylists(); 
    });
</script>

<div class="playlist-container">
    <h2>🎵 Manage Your Playlists</h2>

    <div class="create-playlist">
        <input bind:value={playlistName} placeholder="Playlist Name" />
        <textarea bind:value={playlistDescription} placeholder="Description"></textarea>
        <button on:click={createPlaylist} class="btn primary">+ Create Playlist</button>
    </div>

    {#if $playlists.length > 0}
        <h3>Your Playlists</h3>
        <ul class="playlist-list">
            {#each $playlists as playlist}
                <li class="playlist-item">
                    <div>
                        <button on:click={() => fetchSongsOfPlaylist(playlist.id)} class="btn secondary">
                            🎶 {playlist.name}
                        </button>
                        <button on:click={() => deletePlaylist(playlist.id)} class="btn danger">🗑 Delete</button>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}

    {#if selectedPlaylist}
        <h3>Songs in Playlist</h3>
        <div class="songs-list">
            {#if $playlistSongs.length === 0}
                <p>No songs in this playlist.</p>
            {/if}
            {#each $playlistSongs as song}
                <div class="song-item">
                    <p>{song.title} - {song.artist}</p>
                    <button on:click={() => removeSong(song.id)} class="btn danger small">Remove</button>
                </div>
            {/each}
        </div>
    {/if}

    {#if successMessage}
        <p class="message success">{successMessage}</p>
    {/if}
    {#if errorMessage}
        <p class="message error">{errorMessage}</p>
    {/if}
</div>

<div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Dashboard</button>
</div>

<style>
    .playlist-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h2, h3 {
        text-align: center;
        color: #333;
    }

    h3 {
        margin-top: 20px;
    }

    .create-playlist input,
    .create-playlist textarea {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }

    .create-playlist textarea {
        resize: none;
        height: 100px;
    }

    .playlist-list {
        list-style: none;
        padding: 0;
    }

    .playlist-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        margin: 10px 0;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .playlist-item button {
        margin-right: 10px;
    }

    .songs-list {
        margin-top: 20px;
    }

    .song-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin: 10px 0;
        background: #fafafa;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s;
    }

    .btn:hover {
        transform: translateY(-2px);
    }

    .btn.primary {
        background: #007bff;
        color: white;
    }

    .btn.primary:hover {
        background: #0069d9;
    }

    .btn.secondary {
        background: #17a2b8;
        color: white;
    }

    .btn.secondary:hover {
        background: #138496;
    }

    .btn.danger {
        background: #dc3545;
        color: white;
    }

    .btn.danger:hover {
        background: #c82333;
    }

    .btn.dashboard {
        background: #6c757d;
        color: white;
    }

    .btn.dashboard:hover {
        background: #5a6268;
    }

    .btn.small {
        padding: 5px 10px;
        font-size: 14px;
    }

    .message {
        text-align: center;
        padding: 10px;
        border-radius: 5px;
        margin-top: 20px;
        font-weight: bold;
    }

    .message.success {
        color: #155724;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
    }

    .message.error {
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
</style>