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
        console.log($likes);
    });
</script>

<div class="liked-songs-container">
    {#if error}
        <p class="error-message">{error}</p>
    {/if}
    {#if successMessage}
        <p class="success-message">{successMessage}</p>
    {/if}

    <h2>Your Liked Songs</h2>
    {#if $likes.length === 0}
        <p class="no-likes-message">You have no liked songs yet.</p>
    {:else}
        <ul>
            {#each $likes as song (song.id)}
                <li class="song-item">
                    <span>{song.title} - {song.artist}</span>
                </li>
            {/each}
        </ul>
    {/if}
</div>
<div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>Back to Dashboard</button>
</div>

<style>
    .liked-songs-container {
        margin: 20px;
        padding: 20px;
        background: url(https://cdn-icons-png.flaticon.com/512/3820/3820321.png);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }
    .error-message,
    .success-message {
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
    }
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
    }
    .success-message {
        background-color: #d4edda;
        color: #155724;
    }
    h2 {
        font-size: 24px;
        color: #333;
        font-weight: 600;
        margin-bottom: 20px;
        text-align: center;
    }
    .song-item {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        margin-bottom: 10px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
    }
    .song-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .song-item span {
        font-size: 18px;
        color: #333;
    }
    .song-item span:hover {
        color: #007bff;
        cursor: pointer;
    }

    .no-likes-message {
        text-align: center;
        font-size: 18px;
        color: #666;
        font-weight: 500;
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
