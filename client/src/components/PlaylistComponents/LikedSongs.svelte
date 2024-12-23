<script>
    import { onMount } from 'svelte';
    import { fetchLikedSongs } from '../../exportFunction';
    import { likes } from '../../store';
    import { navigate } from 'svelte-routing';

    let error = '';
    let successMessage = '';

    const navigateToDashboard = () => {
    navigate('/dashboard');
    };

    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchLikedSongs();
    });
</script>

<div class="liked-songs-container">
    {#if error}
        <p class="error-message">{error}</p>
    {/if}
    {#if successMessage}
        <p class="success-message">{successMessage}</p>
    {/if}

    <h2>🎵 Your Liked Songs</h2>
    {#if $likes.length === 0}
        <p class="no-likes-message">You haven't liked any songs yet. Start exploring!</p>
    {:else}
        <ul class="songs-list">
            {#each $likes as song (song.id)}
                <li class="song-item">
                    <span class="song-title">{song.title}</span>
                    <span class="song-artist">by {song.artist}</span>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Dashboard</button>
</div>

<style>
    .liked-songs-container {
        margin: 20px auto;
        padding: 30px;
        max-width: 700px;
        background: linear-gradient(135deg, #f8f9fa 50%, #ffffff 100%);
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
    }

    .error-message,
    .success-message {
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 6px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
    }

    .error-message {
        background-color: #ffe5e5;
        color: #d9534f;
        border: 1px solid #f5c2c7;
    }

    .success-message {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .songs-list {
        list-style: none;
        padding: 0;
    }

    .song-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        margin: 10px 0;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .song-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .song-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
    }

    .song-artist {
        font-size: 16px;
        font-weight: 400;
        color: #666;
    }

    .song-item span:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .no-likes-message {
        font-size: 18px;
        color: #777;
        text-align: center;
        margin-top: 20px;
        font-weight: 500;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .btn.dashboard {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    .btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }
</style>
