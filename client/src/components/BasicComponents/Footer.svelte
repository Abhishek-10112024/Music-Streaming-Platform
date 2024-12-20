<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  export let onTogglePlayPause;
  export let onPlayNextSong;
  export let onPlayPreviousSong;
  export let currentSongTitle = '';
  export let currentSongArtist = '';
  export let isPlaying = false;
  export let songDuration = 0;
  export let currentTime = 0;

  let audioPlayer = new Audio();

  const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
      onTogglePlayPause();  
  };
  
  const playNextSong = () => {
      onPlayNextSong();  
  };
  
  const playPreviousSong = () => {
      onPlayPreviousSong();  
  };

  onMount(() => {
      const token = localStorage.getItem('token')
      if (!token)
      navigate ('/');
  });
</script>
  
<footer>
  <div class="song-details">
    <div class="song-title">{currentSongTitle}</div>
    <div class="song-artist">{currentSongArtist}</div>
  </div>

  <div class="progress-container">
    <div
      class="progress-bar"
      role="slider"
      aria-valuenow="{(currentTime / songDuration) * 100}"
      aria-valuemin="0"
      aria-valuemax="100"
      tabindex="0"
    >
      <div
        class="progress-bar-filled"
        style="width: {(currentTime / songDuration) * 100}%"
      ></div>
    </div>
    <div class="time">{formatDuration(currentTime)} / {formatDuration(songDuration)}</div>
  </div>

  <div class="controls">
    <button
      class="control-btn"
      on:click={playPreviousSong}
      aria-label="Previous Song"
    >
      &#8592;
    </button>

    <button
      class="toggle-btn"
      on:click={togglePlayPause}
      aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
    >
      {isPlaying ? '⏸️' : '▶️'}
    </button>

    <button
      class="control-btn"
      on:click={playNextSong}
      aria-label="Next Song"
    >
      &#8594;
    </button>
  </div>

  <audio id="audio-player" bind:this={audioPlayer}></audio>
</footer>
  
<style>
  footer {
      background-color: #212121;
      color: #fff;
      padding: 1rem 2rem;
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.4);
      z-index: 100;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
  }
  
  .song-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      max-width: 250px;
      padding-right: 1rem;
  }

  .song-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 5px;
      color: #fff;
      letter-spacing: 0.5px;
  }

  .song-artist {
      font-size: 1rem;
      color: #bdbdbd;
  }

  .progress-container {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin: 0 1rem;
  }

  .progress-bar {
      width: 100%;
      height: 5px;
      background-color: #4e4e4e;
      border-radius: 5px;
      position: relative;
      cursor: pointer;
  }

  .progress-bar-filled {
      height: 100%;
      background-color: #ff6347;
      width: 0%;
      border-radius: 5px;
      transition: width 0.2s ease;
  }

  .time {
      font-size: 0.9rem;
      margin-left: 10px;
      color: #bdbdbd;
  }

  .controls {
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .control-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.8rem;
      margin: 0 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .control-btn:hover {
      color: #ff6347;
      transform: scale(1.1);
  }

  .toggle-btn {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: #ff6347;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 2rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .toggle-btn:hover {
      background-color: #e53e1a;
      transform: scale(1.1);
  }

  .toggle-btn:focus,
  .control-btn:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(255, 99, 71, 0.6);
  }

  .control-btn:focus,
  .toggle-btn:focus {
      box-shadow: 0 0 5px 2px rgba(255, 99, 71, 0.8);
  }

</style>
  
  