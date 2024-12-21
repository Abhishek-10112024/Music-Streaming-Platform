<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchPlaylistSongs, fetchUserPlaylists } from '../../exportFunction';
    import { playlistSongs, playlists } from '../../store';

    let selectedPlaylist = '';
    let songIdToAdd = '';
    let songIdToRemove = '';
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
            await fetchPlaylistSongs(playlistId); // Fetch songs using the function
            selectedPlaylist = playlistId; // Set the selected playlist
        } catch (err) {
            errorMessage = 'Error fetching playlist songs';
        }
    };

    // Add a song to a playlist
    const addSongToPlaylist = async () => {
        if (!selectedPlaylist || !songIdToAdd) {
            errorMessage = 'Please select a playlist and provide a song ID to add.';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/playlists/add-song', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId: selectedPlaylist, songId: songIdToAdd }),
            });

            const data = await response.json();
            if (response.ok) {
                successMessage = data.message;
                songIdToAdd = ''; // Reset song ID input
                fetchSongsOfPlaylist(selectedPlaylist); // Fetch updated songs
            } else {
                errorMessage = data.message || 'Error adding song to playlist';
            }
        } catch (err) {
            errorMessage = 'Error adding song to playlist';
        }
    };

    // Remove a song from a playlist
    const removeSongFromPlaylist = async () => {
        if (!selectedPlaylist || !songIdToRemove) {
            errorMessage = 'Please select a playlist and provide a song ID to remove.';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/playlists/remove-song', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId: selectedPlaylist, songId: songIdToRemove }),
            });

            const data = await response.json();
            if (response.ok) {
                successMessage = data.message;
                songIdToRemove = ''; // Reset song ID input
                fetchSongsOfPlaylist(selectedPlaylist); // Fetch updated songs
            } else {
                errorMessage = data.message || 'Error removing song from playlist';
            }
        } catch (err) {
            errorMessage = 'Error removing song from playlist';
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

    // On mount, check if token exists and fetch playlists
    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchUserPlaylists(); // Fetch playlists on component mount
    });
</script>

<div class="container">
    <h2>Create a New Playlist</h2>
    <div class="form-group">
        <label for="playlistName">Playlist Name</label>
        <input type="text" id="playlistName" bind:value={playlistName} placeholder="Enter playlist name" />
    </div>

    <div class="form-group">
        <label for="playlistDescription">Description</label>
        <textarea id="playlistDescription" bind:value={playlistDescription} placeholder="Enter description"></textarea>
    </div>

    <button class="btn btn-primary" on:click={createPlaylist}>Create Playlist</button>
    <hr>

    {#if successMessage}
        <div class="alert alert-success">{successMessage}</div>
    {/if}
    {#if errorMessage}
        <div class="alert alert-danger">{errorMessage}</div>
    {/if}

    <h2>Your Playlists</h2>

    {#if $playlists.length === 0}
        <div>No playlists found.</div>
    {/if}

    {#each $playlists as playlist}
    <div class="playlist-item">
        <button class="btn btn-link" on:click={() => fetchSongsOfPlaylist(playlist.id)} aria-label={`Select playlist: ${playlist.name}`}>
            <span>{playlist.name}</span>
        </button>
        <button class="btn btn-danger" on:click={() => deletePlaylist(playlist.id)}>Delete</button>
    </div>
    {/each}


    {#if selectedPlaylist}
        <h3>Playlist Songs</h3>
        {#if $playlistSongs.length === 0}
            <div>No songs in this playlist.</div>
        {/if}
        {#each $playlistSongs as song}
            <div class="song">
                <span>{song.title} - {song.artist}</span>
            </div>
        {/each}
    {/if}
    <hr>

    <div class="playlist-actions">
        <h3>Add/Remove Songs</h3>

        <div class="form-group">
            <label for="songIdToAdd">Song ID to Add</label>
            <input type="text" id="songIdToAdd" bind:value={songIdToAdd} placeholder="Enter song ID" />
        </div>
        <button class="btn btn-primary" on:click={addSongToPlaylist}>Add Song</button>

        <div class="form-group">
            <label for="songIdToRemove">Song ID to Remove</label>
            <input type="text" id="songIdToRemove" bind:value={songIdToRemove} placeholder="Enter song ID" />
        </div>
        <button class="btn btn-danger" on:click={removeSongFromPlaylist}>Remove Song</button>
    </div>

    <div class="button-container">
        <button class="btn btn-secondary" on:click={navigateToDashboard}>Back to Dashboard</button>
    </div>
</div>

<style>
    * {
        margin: 5px;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
    }

    .container {
        max-width: 800px;
        margin: 30px auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h2, h3 {
        color: #333;
        margin-bottom: 20px;
    }

    hr { 
    display: block;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: auto;
    margin-right: auto;
    border-style: inset;
    border-width: 1px;
    } 

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        font-weight: bold;
        margin-bottom: 5px;
        display: block;
    }

    .form-group input, .form-group textarea {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }

    .form-group input:focus, .form-group textarea:focus {
        border-color: #007bff;
        outline: none;
    }

    .btn {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 6px;
        text-align: center;
        text-decoration: none;
        transition: background-color 0.3s ease;
        margin-right: 10px;
    }

    .btn:hover {
        opacity: 0.9;
    }

    .btn-primary {
        background-color: #007bff;
        color: #fff;
        border: none;
    }

    .btn-primary:hover {
        background-color: #0056b3;
    }

    .btn-danger {
        background-color: #dc3545;
        color: #fff;
        border: none;
    }

    .btn-danger:hover {
        background-color: #c82333;
    }

    .btn-link {
        background: none;
        border: none;
        color: #007bff;
        text-decoration: underline;
    }

    .btn-link:hover {
        color: #0056b3;
    }

    .alert {
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 4px;
        color: white;
    }

    .alert-success {
        background-color: #28a745;
    }

    .alert-danger {
        background-color: #dc3545;
    }

    .playlist-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    .song {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #f1f1f1;
        border-radius: 4px;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
</style>