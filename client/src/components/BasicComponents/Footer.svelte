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
  export let onSeek = (e) => {};

  let audioPlayer = new Audio();

  // Format duration (seconds to MM:SS)
  const formatDuration = (duration) => {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
      onTogglePlayPause();  
  };
  
  // play next song
  const playNextSong = () => {
      onPlayNextSong();  
  };
  
  // play prevoius song
  const playPreviousSong = () => {
      onPlayPreviousSong();  
  };

  // Handle progress bar click for seeking
  const handleProgressClick = (e) => {
    const progressBar = e.target; //e.target refers to the element that was clicked (in this case, the progress bar). This is the element where the event is dispatched
    const clickPosition = e.offsetX; //e.offsetX gives the horizontal position of the mouse click relative to the left edge of the progress bar, This tells us where on the progress bar the user clicked
    const progressWidth = progressBar.offsetWidth; //progressBar.offsetWidth provides the total width of the progress bar element & It's used to determine the entire clickable range of the progress bar
    const seekTo = (clickPosition / progressWidth) * songDuration;
    // This calculates the position in the song (in seconds) that corresponds to the clicked position on the progress bar
    // clickPosition / progressWidth calculates the percentage of the progress bar that was clicked
    // * songDuration then scales that percentage by the total song duration to get the exact time to seek to
    onSeek(seekTo); 
  };


  onMount(() => {
      const token = localStorage.getItem('token')
      if (!token) navigate('/');
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
      on:click={handleProgressClick} on:keydown={handleProgressClick}
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
      background-color: #181818;
      color: #fff;
      padding: 1.5rem 2rem;
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.5);
      z-index: 100;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      transition: background-color 0.3s ease;
      backdrop-filter: blur(10px); 
  }

  .song-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      max-width: 250px;
      padding-right: 1rem;
      overflow: hidden;
  }

  .song-title {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 5px;
      color: #fff;
      letter-spacing: 0.5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 200px; 
  }

  .song-artist {
      font-size: 1.1rem;
      color: #bbb;
      opacity: 0.7;
  }

  .progress-container {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin: 0 1.5rem;
      position: relative;
      min-width: 0; 
  }

  .progress-bar {
      width: 100%;
      height: 6px;
      background-color: #4a4a4a;
      border-radius: 6px;
      position: relative;
      cursor: pointer;
  }

  .progress-bar-filled {
      height: 100%;
      background-color: #1db954; 
      width: 0%;
      border-radius: 6px;
      transition: width 0.3s ease;
  }

  .time {
      font-size: 0.9rem;
      margin-left: 10px;
      color: #bbb;
      opacity: 0.8;
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
      font-size: 2rem;
      margin: 0 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .control-btn:hover {
      color: #1db954; 
      transform: scale(1.2);
  }

  .toggle-btn {
      width:55px;
      height: 55px;
      border-radius: 50%;
      background-color: #1db954; 
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 2.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(29, 185, 84, 0.5);
  }

  .toggle-btn:hover {
      background-color: #1ed760;
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(29, 185, 84, 0.7);
  }

  .toggle-btn:focus,
  .control-btn:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(29, 185, 84, 0.6);
  }

  .control-btn:focus,
  .toggle-btn:focus {
      box-shadow: 0 0 5px 2px rgba(29, 185, 84, 0.8);
  }
</style>