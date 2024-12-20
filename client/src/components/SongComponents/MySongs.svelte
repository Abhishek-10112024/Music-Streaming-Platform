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
    <h2>Your Songs</h2>
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
        <p class="no-songs">You haven't uploaded any songs yet.</p>
    {/if}
</div>

<div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>Back to Dashboard</button>
</div>

<style>
    .songs-container {
        padding: 20px;
        background-color: #f0f4f8;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        max-width: 900px;
        margin: 30px auto;
        background: url(https://cdn-icons-png.flaticon.com/512/3820/3820321.png);
        color: #fff;
        text-align: center;
    }

    h2 {
        font-family: 'Arial', sans-serif;
        color: #333;
        font-size: 30px;
        margin-bottom: 30px;
    }

    .no-songs {
        font-size: 18px;
        color: #555;
    }

    .song-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .song-item {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 15px;
        transition: transform 0.3s ease;
    }

    .song-item:hover {
        transform: translateY(-5px);
    }

    .song-info {
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    .song-title {
        color: #007bff;
    }

    .artist-name {
        font-weight: normal;
        color: #555;
    }

    .song-details {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
    }

    .song-details p {
        margin: 5px 0;
    }

    /* Button container */
    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }

    .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s;
    }

    .btn:hover {
        background-color: #0069d9;
        transform: translateY(-2px);
    }

    .dashboard {
        width: auto;
    }
</style>