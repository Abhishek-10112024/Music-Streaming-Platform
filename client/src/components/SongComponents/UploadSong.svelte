<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  let title = '';
  let artist = '';
  let album = '';
  let genre = '';
  let duration = '';
  let songFile = null;
  let successMessage = '';
  let errorMessage = '';

  // Handle song file change
  const handleFileChange = (event) => {
    songFile = event.target.files[0]; // Set the file from the input
  };

  // Upload song to backend
  const uploadSong = async (event) => {
    event.preventDefault();

    if (!title || !artist || !album || !genre || !duration || !songFile) {
      errorMessage = 'All fields are required!';
      successMessage = ''; 
      return;
    }

    // Create FormData object and append form data
    const formData = new FormData(); //Provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('genre', genre);
    formData.append('duration', duration);
    formData.append('song', songFile);

    try {
      const response = await fetch('http://localhost:5000/api/songs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        successMessage = 'Song uploaded successfully!';
        errorMessage = ''; 
        title = '';
        artist = '';
        album = '';
        genre = '';
        duration = '';
        songFile = null;
      } else {
        const data = await response.json();
        errorMessage = data.message || 'Error uploading song';
        successMessage = ''; 
      }
    } catch (err) {
      console.error('Error uploading song:', err);
      errorMessage = 'Error uploading song';
      successMessage = ''; 
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  });
</script>

<h2>🎶 Upload Your Song</h2>

<div class="form-container">
  {#if successMessage}
    <div class="success">{successMessage}</div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  <form on:submit={uploadSong}>
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={title} placeholder="Enter the song title" required />

    <label for="artist">Artist:</label>
    <input type="text" id="artist" bind:value={artist} placeholder="Enter the artist name" required />

    <label for="album">Album:</label>
    <input type="text" id="album" bind:value={album} placeholder="Enter the album name" required />

    <label for="genre">Genre:</label>
      <select id="genre" bind:value={genre} required>
          <option value="" disabled selected>Select a genre</option>
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="jazz">Jazz</option>
          <option value="classical">Classical</option>
          <option value="hip-hop">Hip-Hop</option>
      </select>

    <label for="duration">Duration:</label>
    <input type="text" id="duration" bind:value={duration} placeholder="Enter duration (e.g., 3:45)" required />

    <label for="song">Song File:</label>
    <input type="file" id="song" accept=".mp3" on:change={handleFileChange} required />

    <button type="submit">🚀 Upload Song</button>
  </form>
</div>

<div class="button-container">
  <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Dashboard</button>
</div>

<style>
  h2 {
    text-align: center;
    color: #333;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #ddd;
  }

  .form-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .form-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 14px;
    color: #555;
  }

  .form-container input[type="text"],
  .form-container input[type="file"] {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    box-sizing: border-box;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .form-container input[type="text"]:focus,
  .form-container input[type="file"]:focus {
    border-color: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
  }

  .form-container button {
    width: 100%;
    padding: 12px 16px;
    background-color: #4caf50;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
  }

  .form-container button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .form-container button:focus {
    outline: none;
    box-shadow: 0 0 6px rgba(72, 212, 103, 0.4);
  }

  .success,
  .error {
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .success {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
  }

  .error {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .btn.dashboard {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .btn.dashboard:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  .btn.dashboard:focus {
    outline: none;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.4);
  }
  select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
  }
</style>